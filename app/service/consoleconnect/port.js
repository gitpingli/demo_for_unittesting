'use strict'

const CcService = require('./cc')
const _ = require('lodash')

class PortService extends CcService {
  async findOne (companyId, id) {
    const { ctx } = this
    ctx.logger.info('find a port, companyId=%s, portId=%s', companyId, id)
    const token = await this.login(companyId)
    const user = await this.curl({
      method: 'GET',
      endpoint: '/api/auth/token',
      token
    })
    const data = await this.curl({
      method: 'GET',
      endpoint: `/api/company/${user.companies[0].username}/ports/${id}`,
      token
    })
    return this.render(data)
  }

  async search (companyId) {
    const { ctx } = this
    ctx.logger.info('search ports,companyId=%s', companyId)
    const token = await this.login(companyId)
    const user = await this.curl({
      method: 'GET',
      endpoint: '/api/auth/token',
      token
    })
    const data = await this.curl({
      method: 'GET',
      endpoint: `/app-user/${user.companies[0].id}/ports?filter=%7B%22where%22%3A%7B%22status%22%3A%7B%22in%22%3A%5B%22ACTIVE%22%5D%7D%7D%7D`,
      token
    })

    return _.map(data, item => this.render(item))
  }

  async getUtilization (companyId, portId, startTime, endTime, resolution) {
    const token = await this.login(companyId)
    const user = await this.curl({
      method: 'GET',
      endpoint: '/api/auth/token',
      token
    })
    return await this.curl({
      method: 'GET',
      endpoint: `/api/company/${user.companies[0].username}/ports/${portId}/utilization?end=${endTime}&start=${startTime}&resolution=${resolution}`,
      token
    })
  }

  render (data) {
    return data
  }
}

module.exports = PortService
