'use strict'

const UmsService = require('./ums')
const _ = require('lodash')

class UserService extends UmsService {
  async findOne (userId) {
    const { ctx } = this
    ctx.logger.info('find user by %s', userId)
    const user = await this.curl({
      method: 'GET',
      endpoint: `/users/${userId}`
    })

    return this.renderUser(user)
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

  async getUsers ({ email, roles, deleted, state = ['ACTIVE'] }) {
    const { ctx } = this
    const querystring = require('querystring')

    const query = {
      type: 'CUSTOMER'
    }

    if (email) {
      query.email = email
    }
    const q = querystring.stringify(query)
    ctx.logger.info('q:%s', q)
    const users = await this.curl({
      method: 'GET',
      endpoint: `/users?${q}`
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

        if (_.indexOf(state, user.state) === -1) {
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
}

module.exports = UserService
