'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class Ledger extends RpcService {
  async blockHash (params) {
    this.init()
    return await this.client.request('ledger_blockHash', params)
  }

  async process (params) {
    this.init()
    return await this.client.request('ledger_process', params)
  }

  async accountInfo (params) {
    this.init()
    return await this.client.request('ledger_accountInfo', params)
  }

  async accountBlocksCount (params) {
    this.init()
    return await this.client.request('ledger_accountBlocksCount', params)
  }

  async accountHistoryTopn (params) {
    this.init()
    return await this.client.request(
      'ledger_accountHistoryTopn',
      ...Object.values(params)
    )
  }

  async accountsBalance (params) {
    this.init()
    return await this.client.request('ledger_accountsBalance', params)
  }

  async blocksInfo (params) {
    this.init()
    return await this.client.request('ledger_blocksInfo', params)
  }

  async blockConfirmedStatus (params) {
    this.init()
    return await this.client.request('ledger_blockConfirmedStatus', params)
  }

  async accountsPending (addresses, count) {
    this.init()
    return await this.client.request(
      'ledger_accountsPending',
      addresses,
      count
    )
  }

  async generateSendBlock (params) {
    this.init()
    return await this.client.request('ledger_generateSendBlock', params)
  }

  async generateReceiveBlock (params) {
    this.init()
    return await this.client.request('ledger_generateReceiveBlock', params)
  }

  async generateChangeBlock (params) {
    this.init()
    return await this.client.request(
      'ledger_generateChangeBlock',
      ...Object.values(params)
    )
  }
}

module.exports = Ledger
