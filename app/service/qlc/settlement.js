'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class Settlement extends RpcService {
  async getContractsByAddress (params) {
    this.init()
    return await this.client.request(
      'settlement_getContractsByAddress',
      ...Object.values(params)
    )
  }

  async getSummaryReport (params) {
    this.init()
    return await this.client.request(
      'settlement_getSummaryReport',
      ...Object.values(params)
    )
  }

  async getAllCDRStatus (params) {
    this.init()
    return await this.client.request(
      'settlement_getAllCDRStatus',
      ...Object.values(params)
    )
  }

  async generateInvoices (params) {
    this.init()
    return await this.client.request(
      'settlement_generateInvoices',
      ...Object.values(params)
    )
  }

  async generateInvoicesByContract (params) {
    this.init()
    return await this.client.request(
      'settlement_generateInvoicesByContract',
      ...Object.values(params)
    )
  }

  async getContractsAsPartyA (params) {
    this.init()
    return await this.client.request(
      'settlement_getContractsAsPartyA',
      ...Object.values(params)
    )
  }

  async getContractsAsPartyB (params) {
    this.init()
    return await this.client.request(
      'settlement_getContractsAsPartyB',
      ...Object.values(params)
    )
  }

  async getCreateContractBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getCreateContractBlock',
      params
    )
  }

  async getSignContractBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getSignContractBlock',
      params
    )
  }

  async getTerminateContractBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getTerminateContractBlock',
      params
    )
  }

  async getAddPreStopBlock (params) {
    this.init()
    return await this.client.request('settlement_getAddPreStopBlock', params)
  }

  async getRemovePreStopBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getRemovePreStopBlock',
      params
    )
  }

  async getUpdatePreStopBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getUpdatePreStopBlock',
      params
    )
  }

  async getAddNextStopBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getAddNextStopBlock',
      params
    )
  }

  async getRemoveNextStopBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getRemoveNextStopBlock',
      params
    )
  }

  async getUpdateNextStopBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getUpdateNextStopBlock',
      params
    )
  }

  async getPreStopNames (params) {
    this.init()
    return await this.client.request(
      'settlement_getPreStopNames',
      params.address
    )
  }

  async getNextStopNames (params) {
    this.init()
    return await this.client.request(
      'settlement_getNextStopNames',
      params.address
    )
  }

  async getProcessCDRBlock (address, params) {
    this.init()
    return await this.client.request(
      'settlement_getProcessCDRBlock',
      address,
      params
    )
  }

  async getSettlementRewardsBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getSettlementRewardsBlock',
      params
    )
  }

  async getContractAddressByPartyANextStop (params) {
    this.init()
    return await this.client.request(
      'settlement_getContractAddressByPartyANextStop',
      params
    )
  }

  async getContractAddressByPartyBPreStop (params) {
    this.init()
    return await this.client.request(
      'settlement_getContractAddressByPartyBPreStop',
      params
    )
  }

  async getRegisterAssetBlock (params) {
    this.init()
    return await this.client.request(
      'settlement_getRegisterAssetBlock',
      params
    )
  }

  async getAllAssets (params) {
    this.init()
    return await this.client.request(
      'settlement_getAllAssets',
      ...Object.values(params)
    )
  }

  async getAssetsByOwner (params) {
    this.init()
    return await this.client.request(
      'settlement_getAssetsByOwner',
      ...Object.values(params)
    )
  }

  async getAsset (params) {
    this.init()
    return await this.client.request('settlement_getAsset', params)
  }

  async generateMultiPartyInvoice (params) {
    this.init()
    return await this.client.request(
      'settlement_generateMultiPartyInvoice',
      ...Object.values(params)
    )
  }

  async generateMultiPartySummaryReport (params) {
    this.init()
    return await this.client.request(
      'settlement_generateMultiPartySummaryReport',
      ...Object.values(params)
    )
  }

  async getMultiPartyCDRStatus (params) {
    this.init()
    return await this.client.request(
      'settlement_getMultiPartyCDRStatus',
      ...Object.values(params)
    )
  }
}

module.exports = Settlement
