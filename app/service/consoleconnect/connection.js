'use strict'

const CcService = require('./cc')
const _ = require('lodash')

class ConnectionService extends CcService {
  async findOne (companyId, id) {
    const { ctx } = this
    ctx.logger.info(
      'find a connection,companyId=%s,connectionId=%s',
      companyId,
      id
    )
    const token = await this.login(companyId)
    const user = await this.curl({
      method: 'GET',
      endpoint: '/api/auth/token',
      token
    })
    const data = await this.curl({
      method: 'GET',
      endpoint: `/api/v2/company/${user.companies[0].username}/connections/${id}`,
      token
    })
    return this.render(data)
  }

  async search (companyId, { portId }) {
    const token = await this.login(companyId)
    const user = await this.curl({
      method: 'GET',
      endpoint: '/api/auth/token',
      token
    })
    const data = await this.curl({
      method: 'GET',
      endpoint: `/api/v2/company/${user.companies[0].username}/connections`,
      token
    })

    return _.map(
      _.filter(data.results, item => {
        if (portId && item.srcPortId !== portId && item.destPortId !== portId) {
          return false
        }
        return true
      }),
      item => this.render(item)
    )
  }

  async getUtilization (
    companyId,
    connectionId,
    startTime,
    endTime,
    resolution
  ) {
    const token = await this.login(companyId)
    const user = await this.curl({
      method: 'GET',
      endpoint: '/api/auth/token',
      token
    })
    return await this.curl({
      method: 'GET',
      endpoint: `/api/company/${user.companies[0].username}/connections/${connectionId}/utilization?end=${endTime}&start=${startTime}&resolution=${resolution}`,
      token
    })
  }

  render (data) {
    return data
  }
}

module.exports = ConnectionService
