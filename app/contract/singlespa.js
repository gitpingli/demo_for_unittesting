'use strict'

module.exports = {

  createSinglespaPayload: {
    name: { type: 'string', required: true },
    url: { type: 'string', required: true },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false }
  },

  singlespaDetail: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    url: { type: 'string', required: true },
    active: { type: 'boolean', required: true },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true }
  }

}
