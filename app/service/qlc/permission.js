'use strict'

const RpcService = require('./rpc')
// const _ = require('lodash');

class Permission extends RpcService {
  async getNodesCount () {
    this.init()
    return await this.client.request('permission_getNodesCount')
  }

  async getNodes (params) {
    this.init()
    return await this.client.request(
      'permission_getNodes',
      ...Object.values(params))
  }

  async getNode (params) {
    this.init()
    return await this.client.request(
      'permission_getNode',
      params)
  }

  async getAdminHandoverBlock (params) {
    this.init()
    return await this.client.request(
      'permission_getAdminHandoverBlock',
      params)
  }

  async getNodeUpdateBlock (params) {
    this.init()
    return await this.client.request(
      'permission_getNodeUpdateBlock',
      params)
  }

  async getAdmin () {
    this.init()
    return await this.client.request('permission_getAdmin')
  }
}

module.exports = Permission
