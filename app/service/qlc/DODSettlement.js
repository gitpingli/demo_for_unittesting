'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class DoDSettlement extends RpcService {
  async getCreateOrderBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getCreateOrderBlock', params)
  }

  async getUpdateOrderInfoBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getUpdateOrderInfoBlock', params)
  }

  async getResponseBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getResponseBlock', params)
  }

  async getChangeOrderBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getChangeOrderBlock', params)
  }

  async getTerminateOrderBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getTerminateOrderBlock', params)
  }

  async getPendingRequest (params) {
    this.init()
    return await this.client.request('DoDSettlement_getPendingRequest', params)
  }

  async getOrderInfo (params) {
    this.init()
    return await this.client.request('DoDSettlement_getOrderInfo', params)
  }

  async getSummaryReport (params) {
    this.init()
    return await this.client.request('DoDSettlement_getSummaryReport', params)
  }

  async generateInvoice (params) {
    this.init()
    return await this.client.request('DoDSettlement_generateInvoice', params)
  }

  async getOrderIdListByAddress (params) {
    this.init()
    return await this.client.request('DoDSettlement_getOrderIdListByAddress', ...Object.values(params))
  }

  async getOrderIdListByAddressAndSeller (params) {
    this.init()
    return await this.client.request('DoDSettlement_getOrderIdListByAddressAndSeller', ...Object.values(params))
  }

  async getProductIdListByAddress (params) {
    this.init()
    return await this.client.request('DoDSettlement_getProductIdListByAddress', ...Object.values(params))
  }

  async getProductIdListByAddressAndSeller (params) {
    this.init()
    return await this.client.request('DoDSettlement_getProductIdListByAddressAndSeller', ...Object.values(params))
  }

  async getOrderInfoBySellerAndOrderId (params) {
    this.init()
    return await this.client.request('DoDSettlement_getOrderInfoBySellerAndOrderId', ...Object.values(params))
  }

  async getConnectionInfoBySellerAndProductId (params) {
    this.init()
    return await this.client.request('DoDSettlement_getConnectionInfoBySellerAndProductId', ...Object.values(params))
  }

  async getPendingResourceCheck (params) {
    this.init()
    return await this.client.request('DoDSettlement_getPendingResourceCheck', ...Object.values(params))
  }

  async getCreateOrderRewardBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getCreateOrderRewardBlock', params)
  }

  async getUpdateOrderInfoRewardBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getUpdateOrderInfoRewardBlock', params)
  }

  async getChangeOrderRewardBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getChangeOrderRewardBlock', params)
  }

  async getTerminateOrderRewardBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getTerminateOrderRewardBlock', params)
  }

  async getUpdateProductInfoBlock (params) {
    this.init()
    return await this.client.request('DoDSettlement_getUpdateProductInfoBlock', params)
  }

  async getOrderInfoByInternalId (params) {
    this.init()
    return await this.client.request('DoDSettlement_getOrderInfoByInternalId', ...Object.values(params))
  }

  async generateInvoiceByOrderId (params) {
    await this.init()
    return await this.client.request('DoDSettlement_generateInvoiceByOrderId', ...Object.values(params))
  }

  async generateInvoiceByProductId (params) {
    await this.init()
    return await this.client.request('DoDSettlement_generateInvoiceByProductId', ...Object.values(params))
  }
}

module.exports = DoDSettlement
