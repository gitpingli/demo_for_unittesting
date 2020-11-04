'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class Pov extends RpcService {
  async getFittestHeader (params) {
    this.init()
    return await this.client.request('pov_getFittestHeader', params)
  }
}

module.exports = Pov
