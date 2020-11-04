'use strict'

module.exports = {
  memberModel: {
    id: { type: 'string', required: true },
    first: { type: 'string', required: true },
    last: { type: 'string', required: true },
    email: { type: 'string', required: true },
    roles: { type: 'array', required: true, itemType: 'string' },
    companyId: { type: 'string', required: true }
  },

  member: {
    data: {
      type: 'memberModel',
      required: true
    }
  },
  memberList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'memberModel'
    },
    meta: { type: 'pageModel', required: true }
  },

  createMemberPayload: {
    first: { type: 'string', required: true },
    last: { type: 'string', required: true },
    email: { type: 'string', required: true },
    roles: { type: 'array', required: false, itemType: 'string' }
  },
  updateMemberPayload: {
    first: { type: 'string', required: false },
    last: { type: 'string', required: false }
  },
  loginMemberPayload: {
    username: { type: 'string', required: true },
    password: { type: 'string', required: true }
  }
}
