'use strict'

const { httpProvider: HttpProvider } = require('qlc.js/provider/HTTP')
const Client = require('qlc.js/client').default
const { Service } = require('egg')
const uuid = require('uuid-random')

class RpcService extends Service {
  async curl (endpoint, payload) {
    const { ctx, config } = this

    const { rpcUrl, timeout = 5000 } = config.qlc
    const data = {
      jsonrpc: '2.0',
      method: endpoint,
      params: payload,
      id: uuid()
    }
    ctx.logger.info('%j', data)
    const result = await ctx.curl(rpcUrl, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data,
      timeout
    })

    ctx.logger.info('response:%j', result)
    if (result.status === 200) {
      return result.data
    }

    ctx.throw(result.status, result)
  }

  async curlPostWorker (data) {
    const { ctx } = this

    const url = 'https://explorer.qlcchain.org/api/node'

    const result = await this.ctx.curl(url, {
      method: 'POST',
      contentType: 'json',
      data,
      dataType: 'json',
      timeout: 60000
    })

    if (result.status === 200) {
      return result.data
    }

    ctx.throw(result.status, result)
  }

  init () {
    const { config } = this
    const provider = new HttpProvider(config.qlc.rpcUrl)
    this.client = new Client(provider, () => {})
  }

  async getPow (hash) {
    const data = {
      params: [hash],
      jsonrpc: '2.0',
      method: 'work',
      id: uuid()
    }
    return await this.curlPostWorker(data)
  }
}

module.exports = RpcService
