'use strict'

module.exports = {

  productModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    type: { type: 'string', required: true, enum: ['ELINE', 'UNI'] },
    code: { type: 'string', required: true },
    provider: { type: 'string', required: false, enum: ['CC', 'CBC'] },
    state: { type: 'string', required: true, enum: ['ENABLED', 'DISABLED'] },
    quoteSpecs: { type: 'object', required: true },
    provisionSpecs: { type: 'object', required: true },
    provisionProcessId: { type: 'string', required: false },
    terminateProcessId: { type: 'string', required: false },
    createdAt: { type: 'string', required: true },
    createdBy: { type: 'string', required: true }
  },

  product: {
    data: {
      type: 'productModel',
      required: true
    }
  },

  productList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'productModel'
    },
    meta: { type: 'pageModel', required: true }
  }
}
