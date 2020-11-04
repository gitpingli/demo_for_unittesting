'use strict'

const { Service } = require('egg')

class HeartbeatService extends Service {
  async get (service) {
    const { ctx } = this
    // const status = { status: 'enabled' }
    const { config } = this
    if (!config.service[service]) {
      return ctx.throw(404, 'Given service ' + service + ' is invalid')
    }
    const url = `${config.service[service].url}/heartbeat`
    ctx.logger.info('url:%s', url)
    const result = await this.ctx.curl(url, {
      dataType: 'json'
    })
    if (result.status === 200) {
      const {
        name = service,
        version = 'N/A',
        description = '',
        status = 'UP'
      } = result.data
      return { name, version, description, status }
    }

    return {
      name: service,
      version: 'UNKNOW',
      description: result.data,
      status: 'DOWN'
    }
  }

  async getInfo () {
    const { ctx, config } = this

    return {
      name: config.name,
      version: config.pkg.version,
      description: config.pkg.description,
      status: 'UP',
      current: new Date().toJSON(),
      startUpAt: ctx.helper.getStartUpAt(),
      releasedAt: require('fs').readFileSync('./release.txt', 'utf8')
    }
  }
}

module.exports = HeartbeatService
