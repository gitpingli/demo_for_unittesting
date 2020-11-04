'use strict'

module.exports = {
  productInstanceModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    companyId: { type: 'string', required: true },
    orderId: { type: 'string', required: true },
    orderItemId: { type: 'string', required: true },
    type: { type: 'string', required: true },
    provisionSpecs: { type: 'object', required: true },
    startedAt: { type: 'string', required: true },
    endedAt: { type: 'string', required: true },
    productId: { type: 'string', required: true },
    productCode: { type: 'string', required: true, enum: ['L2VPN'] },
    productType: { type: 'string', required: true, enum: ['UNI', 'ELINE'] },
    productProvider: { type: 'string', required: true, enum: ['CC', 'CBC'] },
    state: {
      type: 'string',
      required: true,
      enum: [
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'ACTIVEPENDINGTERMINATE',
        'TERMINATED',
        'PENDINGACTIVE',
        'SUSPENDEDPENDINGTERMINATE'
      ]
    },

    resourceId: { type: 'string', required: false },
    resourceState: { type: 'string', required: false },
    createdAt: { type: 'string', required: true },
    createdBy: { type: 'string', required: true },
    completedAt: { type: 'string', required: false },
    completedBy: { type: 'string', required: false },
    cancelledAt: { type: 'string', required: false },
    cancelledBy: { type: 'string', required: false },
    cancellationReason: { type: 'string', required: false },
    details: { type: 'object', required: false }
  },

  productInstance: {
    data: {
      type: 'productInstanceModel',
      required: true
    }
  },

  productInstanceList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'productInstanceModel'
    },
    meta: { type: 'pageModel', required: true }
  }
}
