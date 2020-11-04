'use strict'

module.exports = {
  externalModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    key: { type: 'string', required: true },
    value: { type: 'string', required: true },
    description: { type: 'string', required: false },
    createdAt: { type: 'string', required: false }
  },

  external: {
    data: {
      type: 'externalModel',
      required: true
    }
  },

  externalList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'externalModel'
    },
    meta: { type: 'pageModel', required: true }
  },
  createExternalPayload: {
    key: { type: 'string', required: true },
    value: { type: 'string', required: true },
    description: { type: 'string', required: false }
  },

  updateExternalPayload: {
    key: { type: 'string', required: true },
    value: { type: 'string', required: true },
    description: { type: 'string', required: false }
  }
}
