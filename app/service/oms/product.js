'use strict'

const OmsService = require('../backend')
const _ = require('lodash')

class ProductService extends OmsService {
  async doCurl ({ method, endpoint, payload }) {
    const { config } = this
    const endpointBase =
      config.service.oms.productEndpointBase || '/products/v1'

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

    const { companyId, resourceId, productProvider, productType } = data
    data.details = null
    try {
      // fetch CC port and connection details
      if (companyId && resourceId && productType && productProvider === 'CC') {
        if (productType === 'ELINE') {
          data.details = await ctx.service.consoleconnect.connection.findOne(
            data.companyId,
            resourceId
          )
        } else if (productType === 'UNI') {
          data.details = await ctx.service.consoleconnect.port.findOne(
            data.companyId,
            resourceId
          )
        }
      }
      // fetch IBM virtual server details
      if (companyId && resourceId && productType && productProvider === 'IBM') {
        if (productType === 'CLOUD_VS') {
          data.details = await ctx.service.ibm.virtualServer.findOne(
            resourceId
          )
          const ibmPackage = await ctx.service.ibm.virtualServer.fetchPackage(
            data.provisionSpecs.packageId
          )
          // FIXME: only convert specs in the table
          const IBM_SPEC_TABLE = [
            'os',
            'ram',
            'core',
            'response',
            'bandwidth',
            'monitoring',
            'guest_disk0',
            'notification',
            'service_port',
            'vpn_management',
            'pri_ip_addresses',
            'remote_management',
            'vulnerability_scanner'
          ]

          IBM_SPEC_TABLE.forEach(spec => {
            data.provisionSpecs[spec] = ibmPackage.prices.find(
              obj => obj.id === data.provisionSpecs[spec]
            ).item.description
          })
        }
      }
    } catch (e) {
      ctx.logger.info('product instance:%j', data)
      ctx.logger.error('error on query product instance details:%j', e)
    }
    return this.render(data)
  }

  async search ({
    companyId,
    productId,
    productProvider,
    orderId,
    buyerProductId
  }) {
    const { ctx } = this
    const querystring = require('querystring')
    const query = {}
    if (companyId) {
      query.companyId = companyId
    }

    if (productId) {
      query.productId = productId
    }

    if (productProvider) {
      query.productProvider = productProvider
    }

    if (orderId) {
      query.orderId = orderId
    }

    if (buyerProductId) {
      query.buyerProductId = buyerProductId
    }

    const q = querystring.stringify(query)
    ctx.logger.info('q:%s', q)
    const result = await this.doCurl({
      method: 'GET',
      endpoint: `?${q}`
    })

    return _.map(result.data, item => this.render(item))
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
