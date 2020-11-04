'use strict'

const CpqService = require('../backend')
const _ = require('lodash')

class ProductService extends CpqService {
  async doCurl ({ method, endpoint, payload }) {
    const { config } = this
    const endpointBase = config.service.cpq.productEndpointBase || '/products'
    return await this.curl({
      name: 'cpq',
      method,
      endpoint: `${endpointBase}${endpoint}`,
      payload
    })
  }

  async create (payload) {
    const data = await this.doCurl({
      method: 'POST',
      endpoint: '',
      payload
    })

    return this.render(data)
  }

  async findOne (id) {
    const { ctx } = this
    ctx.logger.info('find product by %s', id)
    const data = await this.doCurl({
      method: 'GET',
      endpoint: `/${id}`
    })
    return this.render(data)
  }

  async search (query) {
    const { ctx } = this
    const querystring = require('querystring')
    const q = querystring.stringify(query)
    ctx.logger.info('q:%s', q)
    const data = await this.doCurl({
      method: 'GET',
      endpoint: `?${q}`
    })

    return _.map(data, item => this.render(item))
  }

  async update (id, payload) {
    const user = await this.doCurl({
      method: 'PATCH',
      endpoint: `/${id}`,
      payload
    })

    return this.render(user)
  }

  async destroy (id) {
    const user = await this.doCurl({
      method: 'DELETE',
      endpoint: `/${id}`
    })

    return this.render(user)
  }

  render (data) {
    return data
  }
}

module.exports = ProductService
