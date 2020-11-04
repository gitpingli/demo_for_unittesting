'use strict'

module.exports = {
  roleModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    description: { type: 'string', required: true },
    deleted: { type: 'boolean', required: true }
  },

  role: {
    data: {
      type: 'roleModel',
      required: true
    }
  },
  roleList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'roleModel'
    }
  },

  createRolePayload: {
    name: { type: 'string', required: true },
    description: { type: 'string', required: true }
  },
  updateRolePayload: {}
}
