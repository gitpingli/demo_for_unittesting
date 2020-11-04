'use strict'

const { Service } = require('egg')

class BaseService extends Service {
  async curl ({ endpoint, method = 'GET', payload }) {
    const { ctx } = this
    const { config } = this

    const url = `${config.gateway.adminUrl}${endpoint}`

    ctx.logger.info('%s %s', method, endpoint)
    const result = await this.ctx.curl(url, {
      method,
      contentType: 'json',
      data: payload,
      dataType: 'json',
      headers: {
        Authorization: config.gateway.token
      }
    })

    if (result.status === 200) {
      return result.data
    }

    ctx.throw(result.status, result)
  }

  async curlAPI ({ endpoint, method = 'GET', token, payload }) {
    const { ctx } = this
    const { config } = this

    const url = `${config.gateway.apiUrl}/${endpoint}`
    const result = await this.ctx.curl(url, {
      method,
      contentType: 'json',
      data: payload,
      dataType: 'json',
      headers: {
        Authorization: token
      }
    })

    if (result.status === 200) {
      return result.data
    }

    ctx.throw(result.status, result)
  }
}

module.exports = BaseService
