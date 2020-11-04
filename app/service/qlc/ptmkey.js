'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class Ptmkey extends RpcService {
  async getPtmKeyByAccount (params) {
    this.init()
    return await this.client.request('ptmkey_getPtmKeyByAccount', params)
  }

  async getPtmKeyByAccountAndBtype (params) {
    this.init()
    return await this.client.request('ptmkey_getPtmKeyByAccountAndBtype', ...Object.values(params))
  }

  async getPtmKeyUpdateBlock (params) {
    this.init()
    return await this.client.request('ptmkey_getPtmKeyUpdateBlock', params)
  }

  async getPtmKeyDeleteBlock (params) {
    this.init()
    return await this.client.request('ptmkey_getPtmKeyDeleteBlock', params)
  }
}

module.exports = Ptmkey
