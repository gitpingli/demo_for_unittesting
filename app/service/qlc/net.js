'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class Net extends RpcService {
  async getOnlinePeersInfo (params) {
    this.init()
    return await this.client.request(
      'net_getOnlinePeersInfo',
      ...Object.values(params))
  }
}

module.exports = Net
