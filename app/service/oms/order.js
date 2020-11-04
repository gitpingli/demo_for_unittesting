'use strict'

const OmsService = require('../backend')
const _ = require('lodash')

class OrderService extends OmsService {
  async doCurl ({ method, endpoint, payload }) {
    const { config } = this
    const endpointBase = config.service.oms.orderEndpointBase || '/orders/v1'

    return await this.curl({
      name: 'oms',
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
    ctx.logger.info('find order by %s', id)
    const data = await this.doCurl({
      method: 'GET',
      endpoint: `/${id}`
    })

    data.company = await ctx.service.ums.company.findOne(data.companyId)
    if (data.createdBy) {
      data.user = await ctx.service.ums.user.findOne(data.createdBy)
    }
    return this.render(data)
  }

  async search ({
    companyId,
    externalId,
    offeringId,
    productId,
    productProvider,
    state,
    page,
    size
  }) {
    const { ctx } = this
    const querystring = require('querystring')
    const query = { page, size }
    if (companyId) {
      query.companyId = companyId
    }

    if (externalId) {
      query.externalId = externalId
    }

    if (offeringId) {
      query.offeringId = offeringId
    }

    if (productId) {
      query.productId = productId
    }

    if (productProvider) {
      query.productProvider = productProvider
    }

    if (state) {
      query.orderStateType = state
    }

    const q = querystring.stringify(query)
    ctx.logger.info('q:%s', q)
    const result = await this.doCurl({
      method: 'GET',
      endpoint: `?${q}`
    })

    const companies = await ctx.service.ums.company.list({ deleted: false })
    const id2Company = _.keyBy(companies, company => company.id)
    return {
      data: _.map(result.data, item => {
        item.company = id2Company[item.companyId]
        return this.render(item)
      }),
      meta: {
        total: result.total,
        page,
        per_page: size
      }
    }
  }

  async update (id, payload) {
    const data = await this.doCurl({
      method: 'PATCH',
      endpoint: `/${id}`,
      payload
    })

    return this.render(data)
  }

  async destroy (id) {
    const data = await this.doCurl({
      method: 'DELETE',
      endpoint: `/${id}`
    })

    return this.render(data)
  }

  async viewLogs (id, query) {
    const result = await this.doCurl({
      method: 'GET',
      endpoint: `/${id}/logs`,
      payload: query
    })

    return {
      data: _.map(result.data, item => this.render(item)),
      meta: {
        total: result.total,
        page: result.page,
        per_page: result.size
      }
    }
  }

  async fetchOrdersByProductInstance (productInstanceId, query) {
    const result = await this.doCurl({
      method: 'GET',
      endpoint: `/productInstance/${productInstanceId}`,
      payload: query
    })

    return {
      data: _.map(result.data, item => this.render(item)),
      meta: {
        total: result.total,
        page: result.page,
        per_page: result.size
      }
    }
  }

  render (data) {
    return data
  }
}

module.exports = OrderService
