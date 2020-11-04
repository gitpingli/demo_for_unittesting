'use strict'

module.exports = {

  offerModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    createdAt: { type: 'string', required: true },
    createdBy: { type: 'string', required: true },
    product: {
      type: 'productModel',
      required: true
    }
  },

  offering: {
    data: {
      type: 'offerModel',
      required: true
    }
  },

  offeringList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'offerModel'
    },
    meta: { type: 'pageModel', required: true }
  }
}
