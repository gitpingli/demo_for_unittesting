'use strict'

module.exports = {
  userModel: {
    id: { type: 'string', required: true },
    first: { type: 'string', required: true },
    last: { type: 'string', required: true },
    email: { type: 'string', required: true },
    roles: { type: 'array', required: true, itemType: 'string' }
  },

  authToken: {
    data: {
      type: 'string',
      required: true
    }
  },

  user: {
    data: {
      type: 'userModel',
      required: true
    }
  },
  pageModel: {
    total: { type: 'integer', required: true },
    per_page: { type: 'integer', required: true },
    page: { type: 'integer', required: true }
  },
  userList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'userModel'
    },
    meta: { type: 'pageModel', required: true }
  },
  inviteUserPayload: {
    first: { type: 'string', required: true },
    last: { type: 'string', required: true },
    email: { type: 'string', required: true }
  },
  createUserPayload: {
    first: { type: 'string', required: true },
    last: { type: 'string', required: true },
    email: { type: 'string', required: true },
    roles: { type: 'array', required: false, itemType: 'string' },
    password: { type: 'string', required: true }
  },
  updateUserPayload: {
    first: { type: 'string', required: false },
    last: { type: 'string', required: false }
  },
  loginUserPayload: {
    username: { type: 'string', required: true },
    password: { type: 'string', required: true }
  }
}
