'use strict'

const { Service } = require('egg')

class BackendService extends Service {
  async curl ({ name, endpoint, method = 'GET', payload }) {
    const { ctx } = this
    const { config } = this

    const { url, enabled, timeout = 5000 } = config.service[name]

    const baseUrl = `${url}${endpoint}`
    const req = {
      method,
      contentType: 'json',
      dataType: 'json',
      data: payload,
      headers: {
        Authorization: ctx.request.header.authorization
      },
      timeout
    }

    ctx.logger.info('%s %s', method, baseUrl)
    //  ctx.logger.info('payload:%j', req);

    const result = enabled
      ? await ctx.curl(baseUrl, req)
      : await require('../../../mockData/backendServiceManagement').curl(endpoint, req)

    // ctx.logger.info('result:%j', result);

    if (result.status === 200 || result.status === 201) {
      return result.data
    }

    ctx.logger.info('result:%j', result)

    ctx.throw(result.status, result.data)
  }
}

module.exports = BackendService
