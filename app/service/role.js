'use strict'

const Service = require('egg').Service

const Role = require('../../mockData/roleManagement')

class RoleService extends Service {
  async create (request) {
    return await Role.create(request)
  }

  async list (query) {
    return await Role.findAll(query)
  }

  async findById (id) {
    const { ctx } = this
    const role = await Role.findOne(id)
    if (role) {
      return role
    }
    ctx.throw(404, `role(${id}) not found`)
  }

  async update (id, payload) {
    const { ctx } = this
    ctx.logger.info('update %s,%j', id, payload)
    const role = await this.findById(id)
    return role
  }
}

module.exports = RoleService
