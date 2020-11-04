'use strict'

const UmsService = require('./ums')
const _ = require('lodash')

class MemberService extends UmsService {
  async create (companyId, payload) {
    const roles = payload.roles ? payload.roles : ['PARTNER_USER']
    const isPartnerUser = _.intersection(roles, ['PARTNER_SUPER_ADMIN', 'PARTNER_ADMIN', 'PARTNER_USER']).length > 0
    const req = {
      firstname: payload.first,
      lastname: payload.last,
      email: payload.email,
      roles,
      isPartnerUser,
      companyId
    }
    if (payload.address) {
      const address = payload.address
      req.address = {
        telephone: address.telephone,
        street: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        zip: address.zip
      }
    }
    const user = await this.curl({
      method: 'POST',
      endpoint: '/users/signup',
      payload: req
    })

    return this.renderMember(user)
  }

  async findOne (companyId, userId) {
    const { ctx } = this
    ctx.logger.info('find user by %s', userId)
    const user = await this.curl({
      method: 'GET',
      endpoint: `/users/${userId}`
    })

    return this.renderMember(user)
  }

  async list (companyId) {
    const users = await this.curl({
      method: 'GET',
      endpoint: `/users?companyId=${companyId}`
    })

    return _.map(users, user => this.renderMember(user))
  }

  async update (companyId, id, payload) {
    const user = await this.curl({
      method: 'PATCH',
      endpoint: `/users/${id}`,
      payload
    })

    return this.renderMember(user)
  }

  async destroy (companyId, id) {
    const user = await this.curl({
      method: 'DELETE',
      endpoint: `/users/${id}`
    })

    return this.renderMember(user)
  }

  renderMember (user) {
    return {
      id: user.id,
      deleted: user.deleted,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      deletedBy: user.deletedBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      email: user.email,
      roles: user.roles,
      companyId: user.company,
      state: user.state,
      type: user.type,
      lastLogonDate: user.lastLogonDate,
      first: user.firstname,
      last: user.lastname,
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      address: user.address
        ? {
          telephone: user.address.telephone,
          address: user.address.street,
          city: user.address.city,
          state: user.address.state,
          country: user.address.country,
          zip: user.address.zip
        }
        : undefined
    }
  }
}

module.exports = MemberService
