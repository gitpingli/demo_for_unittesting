'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class AccountService extends RpcService {
  async create (params) {
    this.init()
    return await this.client.request('account_create', params.seed)
  }

  async newAccounts (params) {
    this.init()
    return await this.client.request('account_newAccounts', params)
  }

  async forPublicKey (params) {
    this.init()
    return await this.client.request('account_forPublicKey', params)
  }

  async publicKey (params) {
    this.init()
    return await this.client.request('account_publicKey', params)
  }
}

module.exports = AccountService
