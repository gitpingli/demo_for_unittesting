'use strict'

const BackendService = require('../backend')

class IBMService extends BackendService {
  async doCurl ({ method, endpoint, payload }) {
    const { config } = this
    const endpointBase =
      config.service.oms.IBMEndpointBase || '/ibm/virtualservers/v1'

    return await this.curl({
      name: 'oms',
      method,
      endpoint: `${endpointBase}${endpoint}`,
      payload
    })
  }

  async findOne (id) {
    const { ctx } = this
    ctx.logger.info('find ibm virtualserver by %s', id)
    const data = await this.doCurl({
      method: 'GET',
      endpoint: `/${id}`
    })
    return this.render(data)
  }

  async fetchPackage (packageId) {
    const { ctx } = this
    ctx.logger.info('find ibm virtualserver package by %s', packageId)
    const data = await this.doCurl({
      method: 'GET',
      endpoint: `/packages/${packageId}/items`
    })
    return this.render(data)
  }

  render (data) {
    return data
  }
}

module.exports = IBMService
