'use strict'

const moment = require('moment')
const { InfluxDB } = require('@influxdata/influxdb-client')
const { Service } = require('egg')

// influx range shortcuts, last day/week/month/year
const SHORTCUTS = {
  D: '|> range(start:-1d)',
  W: '|> range(start:-1w)',
  M: '|> range(start:-1mo)',
  Y: '|> range(start:-1y)',
  ALL: '|> range(start: 0)'
}

// 1ms - 1 millisecond
// 1s  - 1 second
// 1m  - 1 minute
// 1h  - 1 hour
// 1d  - 1 day
// 1w  - 1 week
// 1mo - 1 calendar month
// 1y  - 1 calendar year
const INTERVAL_REGEX = new RegExp(/^\d+(y|mo|w|d|h|m|s|ms)/)

class DashboardService extends Service {
  constructor (app) {
    super(app)

    this.influxClient = new InfluxDB({
      url: this.config.influx.url,
      token: this.config.influx.token
    })
      .getQueryApi(this.config.influx.org)
      .with({})
    this.bucket = this.config.influx.bucket
  }

  filterRange (query) {
    const validateFromTo = (query) => {
      const [from, to] = [query.from, query.to].map((i) =>
        moment(i, 'YYYY-MM-DD')
      )

      if (!from.isValid() || !to.isValid() || from > to) {
        return this.ctx.throw(400, 'invalidate query date')
      }
      // add 1 day so it will inlucde 'to' date
      to.add(1, 'd')
      return `|> range(start: ${from.format()}, stop: ${to.format()})`
    }
    // custom date range overrides shortcuts
    if (
      Object.prototype.hasOwnProperty.call(query, 'from') &&
      Object.prototype.hasOwnProperty.call(query, 'to')
    ) {
      return validateFromTo(query)
    }
    if (Object.keys(SHORTCUTS).includes(query.shortcuts)) {
      return SHORTCUTS[query.shortcuts]
    }
    return SHORTCUTS.W
  }

  filterTimeInterval (query) {
    if (INTERVAL_REGEX.test(query.interval)) {
      return `|> window(every: ${query.interval})`
    }
    // PLATPO-1307 shortcuts are longer then 1 month, window to 1 day
    if (['M', 'Y', 'ALL'].includes(query.shortcuts)) {
      return '|> window(every: 1d)'
    }
    return '|> window(every: 1h)'
  }

  genServiceUsageCountFlux (query, type, apiId = null) {
    const flux = [
      `from(bucket: "${this.bucket}")`,
      this.filterRange(query),
      '', // filter for apiID
      '', // filter for for error/success
      '|> group()|> sort()',
      this.filterTimeInterval(query),
      '|> group(columns: ["_start"])|> count()',
      '|> yield(name: "Hits")'
    ]
    if (apiId !== null) {
      flux.splice(2, 1, `|> filter(fn: (r) => r.APIID == "${apiId}")`)
    }
    if (type === 'error') {
      flux.splice(3, 1, '|> filter(fn: (r) => r.ResponseCode =~ /[45].{2}/)')
      flux.splice(7, 1, '|> yield(name: "Error")')
    }
    if (type === 'success') {
      flux.splice(3, 1, '|> filter(fn: (r) => r.ResponseCode =~ /[23].{2}/)')
      flux.splice(7, 1, '|> yield(name: "Success")')
    }
    return flux.join('')
  }

  genTop3CountFlux (query, type) {
    const flux = [
      `from(bucket: "${this.bucket}")`,
      this.filterRange(query),
      '', // filter for error
      '|> group(columns:[ "APIName", "APIID"])|> count() |> group()',
      '|> sort(columns: ["APIName" ], desc: true)'
    ]
    if (type === 'error') {
      flux.splice(2, 1, '|> filter(fn: (r) => r.ResponseCode =~ /[45].{2}/)')
    }
    return flux.join('')
  }

  genBreakdownCountFlux (query) {
    const flux = [
      `from(bucket: "${this.bucket}")`,
      this.filterRange(query),
      '|> group(columns: ["ResponseCode"])|> count()',
      '|> yield(name: "count")'
    ]
    return flux.join('')
  }

  genKeyCountFlux (query, keyHash) {
    const flux = [
      `from(bucket: "${this.bucket}")`,
      this.filterRange(query),
      `|> filter(fn: (r) => r.APIKey == "${keyHash}")`,
      '|> group()|> count()',
      '|> yield(name: "count")'
    ]
    return flux.join('')
  }

  async usageOfServices (query) {
    this.ctx.logger.info('usageOfServices payload: %j', query)

    const filterKeys = ['total', 'error', 'success']
    let fluxQueries = filterKeys.map((type) => {
      return this.genServiceUsageCountFlux(query, type)
    })

    if (new RegExp(/^\d+$/).test(query.id)) {
      const service = await this.ctx.model.Service.findOne({
        where: { id: query.id }
      })
      if (!service) {
        this.ctx.throw(400, `service not found by ${query.id}`)
      }
      fluxQueries = filterKeys.map((type) => {
        return this.genServiceUsageCountFlux(query, type, service.apiId)
      })
    }

    const result = await Promise.all(
      fluxQueries.map(async (q) => {
        return await this.influxClient.collectRows(q)
      })
    )
    return result
  }

  async usageOfTops (query) {
    this.ctx.logger.info('usageOfTops payload: %j', query)

    const filterKeys = ['total', 'error']
    const fluxQueries = filterKeys.map((type) => {
      return this.genTop3CountFlux(query, type)
    })

    const result = await Promise.all(
      fluxQueries.map(async (q, idx) => {
        return await this.influxClient.collectRows(q)
      })
    )
    return result
  }

  async usageBreakdown (query) {
    this.ctx.logger.info('usageBreakdown payload: %j', query)

    const fluxQuery = this.genBreakdownCountFlux(query)

    return await this.influxClient.collectRows(fluxQuery)
  }

  async usageOfOneApplication (id, query) {
    this.ctx.logger.info(`usageOfOneApplication: ${id} payload: %j`, query)

    const application = await this.ctx.model.Application.findOne({
      where: { id }
    })
    if (!application) {
      this.ctx.throw(400, `application not found by ${id}`)
    }

    const keys = await application.getKeys()
    if (keys.length > 0) {
      const res = await Promise.all(
        keys.map(async (k) => {
          const fluxQuery = this.genKeyCountFlux(query, k.hash)
          const keyRes = await this.influxClient.collectRows(fluxQuery)
          // key is not used, so influx returns an empty list
          if (keyRes.length === 0) {
            return {
              value: k.value,
              _value: '0'
            }
          }
          keyRes[0].value = k.value
          return keyRes[0]
        })
      )
      return res
    }
    // no keys on this application
    return []
  }
}

module.exports = DashboardService
