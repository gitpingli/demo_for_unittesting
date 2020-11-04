'use strict'

const UmsService = require('./ums')
const _ = require('lodash')

class AgentService extends UmsService {
  async create (payload) {
    const user = await this.curl({
      method: 'POST',
      endpoint: '/users',
      payload: {
        firstname: payload.first,
        lastname: payload.last,
        email: payload.email,
        password: payload.password,
        roles: payload.roles
      }
    })

    return this.renderUser(user)
  }

  async findOne (userId) {
    const { ctx } = this
    ctx.logger.info('find user by %s', userId)
    const user = await this.curl({
      method: 'GET',
      endpoint: `/users/${userId}`
    })

    return this.renderUser(user)
  }

  async getLoggedInUser () {
    return await this.findOne('profile')
  }

  renderUser (user) {
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
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    }
  }

  async getUsers ({ email, roles, deleted }) {
    let query = 'type=AGENT'

    if (email) {
      query += `&email=${email}`
    }
    const users = await this.curl({
      method: 'GET',
      endpoint: `/users?${query}`
    })

    return _.map(
      _.filter(users, user => {
        if (deleted && user.deleted !== (deleted === 'true')) {
          return false
        }
        if (
          roles &&
          _.intersection(roles.split(','), user.roles).length === 0
        ) {
          return false
        }
        return true
      }),
      user => this.renderUser(user)
    )
  }

  async update (id, payload) {
    const user = await this.curl({
      method: 'PATCH',
      endpoint: `/users/${id}`,
      payload
    })

    return this.renderUser(user)
  }

  async destroy (id) {
    const user = await this.curl({
      method: 'DELETE',
      endpoint: `/users/${id}`
    })

    return this.renderUser(user)
  }

  async login (username, password) {
    const payload = await this.curl({
      method: 'POST',
      endpoint: '/users/login',
      payload: {
        username,
        password
      }
    })
    return payload.key
  }

  async logout () {
    const { ctx } = this
    ctx.logger.info('logout')
  }

  async invite () {
    const { ctx } = this
    ctx.logger.info('invite')
  }
}

module.exports = AgentService
