'use strict'

const { Service } = require('egg')

class SonataBackEndBaseService extends Service {
  async curl ({ service, endpoint, method = 'GET', payload }) {
    const { ctx } = this
    const { config } = this
    if (!config.service[service]) {
      return ctx.throw(404, 'Given service ' + service + ' is invalid')
    }

    const url = `${config.service[service].url}${endpoint}`

    ctx.logger.info('%s %s %s', service, method, endpoint)
    const result = await this.ctx.curl(url, {
      method,
      contentType: 'json',
      data: payload,
      dataType: 'json'
    })

    if (result.status === 200) {
      return result.data
    }

    ctx.throw(result.status, result)
  }
}

module.exports = SonataBackEndBaseService
