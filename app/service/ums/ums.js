'use strict'

const { Service } = require('egg')

class UmsService extends Service {
  async curl ({ endpoint, method = 'GET', payload }) {
    const { ctx } = this
    const { config } = this

    const { url, enabled, timeout = 5000, tokenName, tokenBearer, tokenBearerEnabled } = config.service.user

    const baseUrl = `${url}${endpoint}`
    const headers = {}
    const token = ctx.helper.getAccessToken()
    if (token) {
      headers[tokenName] = tokenBearerEnabled ? tokenBearer.concat(' ', token) : token
    }

    const req = {
      method,
      contentType: 'json',
      dataType: 'json',
      data: payload,
      headers,
      timeout
    }

    ctx.logger.info('%s %s', method, baseUrl)

    // ctx.logger.info('payload:%j', req);

    const result = enabled
      ? await ctx.curl(baseUrl, req)
      : await require('../../../mockData/userManagement').curl(endpoint, req)

    // ctx.logger.info('result:%j', result);

    if (result.status === 200 || result.status === 201) {
      return result.data
    }

    ctx.logger.info('result:%j', result)

    ctx.throw(result.status, result.data)
  }
}

module.exports = UmsService
