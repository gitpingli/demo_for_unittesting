'use strict'

const { Service } = require('egg')

class ConsoleConnectService extends Service {
  async login (companyId) {
    const { ctx } = this
    const company = await ctx.service.ums.company.findOne(companyId)
    const consoleconnect = company.consoleconnect
    if (consoleconnect && consoleconnect.enabled) {
      const { email, password } = consoleconnect
      const data = await this.doLogin(email, password)
      return data.token
    }

    ctx.throw(403, 'No permission to access ConsoleConnect resources')
  }

  async doLogin (email, password) {
    const { ctx } = this
    const { config } = this

    const { url, timeout = 5000 } = config.service.consoleconnect

    const baseUrl = `${url}/api/auth/token`
    const req = {
      method: 'PUT',
      contentType: 'json',
      dataType: 'json',
      data: { email, password },
      timeout
    }

    const result = await ctx.curl(baseUrl, req)

    // ctx.logger.info('result:%j', result);

    if (result.status === 200 || result.status === 201) {
      return result.data
    }

    ctx.logger.info('ConsoleConnectService doLogin result:%j', result)

    ctx.throw(result.status, result.data)
  }

  async curl ({ endpoint, method = 'GET', payload, token }) {
    const { ctx } = this
    const { config } = this

    const { url, enabled, timeout = 5000 } = config.service.consoleconnect

    const baseUrl = `${url}${endpoint}`
    const req = {
      method,
      contentType: 'json',
      dataType: 'json',
      data: payload,
      headers: {
        'portal-token': token || await this.login()
      },
      timeout
    }

    ctx.logger.info('ConsoleConnectService curl %s %s', method, baseUrl)

    const result = enabled
      ? await ctx.curl(baseUrl, req)
      : await require('../../../mockData/backendServiceManagement').curl(
        endpoint,
        req
      )

    if (result.status === 200 || result.status === 201) {
      return result.data
    }

    ctx.logger.info('ConsoleConnectService curl result:%j', result)

    ctx.throw(result.status, result.data)
  }
}

module.exports = ConsoleConnectService
