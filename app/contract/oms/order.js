'use strict'

module.exports = {
  orderItemModel: {
    id: { type: 'string', required: true },
    state: {
      type: 'string',
      required: true,
      enum: ['DRAFT',
        'ACKNOWLEDGED',
        'REJECTED',
        'INPROGRESS',
        'PENDING',
        'HELD',
        'ASSESSINGCANCELLATION',
        'PENDINGCANCELLATION',
        'CANCELLED',
        'INPROGRESS_CONFIGURED',
        'FAILED',
        'COMPLETED']
    },
    externalId: { type: 'string', required: true },
    action: { type: 'string', required: true, enum: ['ADD', 'UPDATE', 'REMOVE', 'NONE'] },
    quoteId: { type: 'string', required: true },
    offeringId: { type: 'string', required: true },
    provisionSpecs: { type: 'object', required: true },
    refOrderId: { type: 'string', required: true },
    refOrderItemId: { type: 'string', required: true },
    activatedAt: { type: 'string', required: true },
    terminatedAt: { type: 'string', required: true },
    productId: { type: 'string', required: true },
    productCode: { type: 'string', required: true, enum: ['L2VPN'] },
    productType: { type: 'string', required: true, enum: ['UNI', 'ELINE'] },
    productProvider: { type: 'string', required: true, enum: ['CC', 'CBC'] },
    totalAmount: { type: 'string', required: true },
    currency: { type: 'string', required: true }
  },

  orderModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    companyId: { type: 'string', required: true },
    externalId: { type: 'string', required: false },
    projectId: { type: 'string', required: false },
    action: { type: 'string', required: true, enum: ['ADD', 'UPDATE', 'REMOVE'] },
    state: {
      type: 'string',
      required: true,
      enum: ['DRAFT',
        'ACKNOWLEDGED',
        'REJECTED',
        'INPROGRESS',
        'PENDING',
        'HELD',
        'ASSESSINGCANCELLATION',
        'PENDINGCANCELLATION',
        'CANCELLED',
        'INPROGRESS_CONFIGURED',
        'INPROGRESS_CONFIRMED',
        'INPROGRESS_JEOPARDY',
        'FAILED',
        'PARTIAL',
        'COMPLETED']
    },
    paymentType: { type: 'string', required: true },
    billingType: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
    createdBy: { type: 'string', required: true },
    completedAt: { type: 'string', required: false },
    completedBy: { type: 'string', required: false },
    cancelledAt: { type: 'string', required: false },
    cancelledBy: { type: 'string', required: false },
    cancellationReason: { type: 'string', required: false },

    items: {
      type: 'array',
      required: true,
      itemType: 'orderItemModel'
    }
  },

  order: {
    data: {
      type: 'orderModel',
      required: true
    }
  },

  orderList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'orderModel'
    },
    meta: { type: 'pageModel', required: true }
  },

  createOrderItemPayload: {
    externalId: { type: ['string', null], required: false },
    action: { type: 'string', required: true, enum: ['ADD', 'UPDATE', 'REMOVE', 'NONE'] },
    quoteId: { type: 'string', required: true },
    offeringId: { type: 'string', required: true },
    provisionSpecs: { type: 'object', required: false },
    refOrderId: { type: 'string', required: false },
    refOrderItemId: { type: 'string', required: false },
    activatedAt: { type: 'string', required: false },
    terminatedAt: { type: 'string', required: false }
  },
  createOrderPayload: {
    companyId: { type: 'string', required: true },
    externalId: { type: ['string', null], required: false },
    projectId: { type: 'string', required: false },
    action: { type: 'string', required: true, enum: ['ADD', 'UPDATE', 'REMOVE'] },
    ready: { type: 'boolean', required: true },
    items: {
      type: 'array',
      required: true,
      itemType: 'createOrderItemPayload'
    }
  },
  updateOrderPayload: {
    state: {
      type: 'string',
      required: true,
      enum: ['DRAFT',
        'ACKNOWLEDGED',
        'REJECTED',
        'INPROGRESS',
        'PENDING',
        'HELD',
        'ASSESSINGCANCELLATION',
        'PENDINGCANCELLATION',
        'CANCELLED',
        'INPROGRESS_CONFIGURED',
        'INPROGRESS_CONFIRMED',
        'INPROGRESS_JEOPARDY',
        'FAILED',
        'PARTIAL',
        'COMPLETED']
    }
  }
}
