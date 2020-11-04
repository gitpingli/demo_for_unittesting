'use strict'

const UmsService = require('./ums')

class ExternalService extends UmsService {
  async create (companyId, payload) {
    const endpoint = `/companies/${companyId}/externals`

    const external = await this.curl({
      method: 'POST',
      endpoint,
      payload
    })

    return external
  }

  async findOne (companyId, id) {
    const { ctx } = this
    const endpoint = `/companies/${companyId}/externals/${id}`

    const external = await this.curl({
      method: 'GET',
      endpoint
    })
    if (!external) {
      ctx.throw(400, 'external not found')
    }
    return external
  }

  async list (companyId) {
    const endpoint = `/companies/${companyId}/externals`

    const externals = await this.curl({
      method: 'GET',
      endpoint
    })
    return externals
  }

  async update (companyId, id, payload) {
    const endpoint = `/companies/${companyId}/externals/${id}`

    const external = await this.curl({
      method: 'PUT',
      endpoint,
      payload
    })

    return external
  }

  async destroy (companyId, id) {
    const endpoint = `/companies/${companyId}/externals/${id}`

    const external = await this.curl({
      method: 'DELETE',
      endpoint
    })

    return external
  }
}

module.exports = ExternalService
