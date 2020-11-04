'use strict'

const SonataBaseService = require('./sonataBackEnd')

class ProductOfferingService extends SonataBaseService {
  async list (query) {
    this.ctx.logger.info('ProductOffering list payload: %j', query)
    // trim undefined
    Object.keys(query).forEach(
      key => [undefined].includes(query[key]) && delete query[key]
    )
    return await this.curl({
      service: 'cpq',
      method: 'GET',
      endpoint: '/offerings',
      payload: query
    })
  }

  async show (id) {
    this.ctx.logger.info('ProductOffering detail: %j', id)
    return await this.curl({
      service: 'cpq',
      method: 'GET',
      endpoint: `/offerings/${id}`
      // payload: query,
    })
  }

  async getOfferingProviders (query) {
    this.ctx.logger.info('showOfferingProviders payload: %j', query)
    // trim undefined
    Object.keys(query).forEach(
      key => [undefined].includes(query[key]) && delete query[key]
    )
    return await this.curl({
      service: 'cpq',
      method: 'GET',
      endpoint: '/providers',
      payload: query
    })
  }
}

module.exports = ProductOfferingService
