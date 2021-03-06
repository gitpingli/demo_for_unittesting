'use strict'

module.exports = {
  createProductOrderReq: {
    name: {
      type: 'string',
      required: false,
      description: 'Order name if needed'
    },
    description: {
      type: 'string',
      required: false,
      description: 'Description of the order if needed'
    },
    // not need for sonata, but need to send to oms
    // companyId: {
    //   type: 'string',
    //   required: true,
    //   description: 'company id get from user management for OMS',
    // },
    externalId: {
      type: 'string',
      required: false,
      description:
        'ID given by the consumer and only understandable by him (to facilitate his searches afterwards)'
    },
    projectId: {
      type: 'string',
      required: false,
      description: 'ProjectId of the order if needed'
    },
    orderActivity: {
      type: 'string',
      enum: ['INSTALL', 'CHANGE', 'DISCONNECT'],
      required: false,
      // map to action, ADD
      description:
        'If orderActivity is set to INSTALL, all orderItemAction must be INSTALL'
    },
    orderItem: { type: 'array', required: true, itemType: 'orderItem' },
    billingType: {
      type: 'string',
      enum: ['PAYG', 'DOM'],
      required: false,
      default: 'PAYG',
      description: 'Ponder/Sherpa supported billingType'
    },
    paymentType: {
      type: 'string',
      enum: ['CREDITCARD', 'INVOICE'],
      required: false,
      default: 'CREDITCARD',
      description: 'Ponder/Sherpa supported paymentType'
    }
    // alway set ready to true
    // not need for sonata, but need to send to oms
    // ready: { type: 'boolean', default: true, required: false },
  },

  orderItem: {
    id: {
      type: 'string',
      required: false,
      description:
        'Identifier of the quote item (generally it is a sequence number 01, 02, 03, ...), set by Buyer'
    },
    action: {
      type: 'string',
      enum: ['INSTALL', 'CHANGE', 'DISCONNECT'],
      required: false,
      default: 'INSTALL',
      description:
        'If orderActivity is set to INSTALL, all orderItemAction must be INSTALL'
    },
    // quoteId
    quote: {
      type: 'quoteForOrder',
      required: true,
      description: 'quoteId obtained in the create quote process'
    },
    // productOfferingId
    productOffering: {
      type: 'productOfferingForOrder',
      required: true,
      description: 'productOfferingId obtained in the create quote process'
    },
    // need to add product
    product: {
      type: 'productForOrder',
      required: true,
      description:
        'One or more services sold to a Buyer by a Seller.  A particular Product Offering defines the technical and commercial attributes and behaviors of a Product.'
    }
    // two refids below used in "change" orders
    // refOrderId: {
    //   type: 'string',
    //   required: false,
    //   description:
    //     'Ponder/Sherpa reference order ID, reference to previous order to that need to be changed',
    // },
    // refOrderItemId: {
    //   type: 'string',
    //   required: false,
    //   description:
    //     'Ponder/Sherpa reference orderItem ID, reference to previous items to that need to be changed',
    // },
  },

  quoteForOrder: {
    id: {
      type: 'string',
      required: false,
      description: 'Unique identifier of the quote'
    },
    quoteItem: {
      type: 'string',
      required: false,
      description: 'Identifier of the quote item'
    }
  },

  productOfferingForOrder: {
    id: {
      type: 'string',
      required: false,
      description: 'Unique identifier of the productOffering'
    }
  },

  productForOrder: {
    // id refid below used in "change/disconnect" orders
    id: {
      type: 'string',
      required: false,
      description:
        'Unique identifier of the product, Ponder/Sherpa reference productInstance ID, reference to previous items to that need to be changed, used in "change/disconnect" orders'
    },
    buyerProductId: {
      type: 'string',
      required: false,
      description: 'Buyer product Id - informative information'
    },
    productSpecification: {
      type: 'productSpecificationForOrder',
      required: false
    }
  },

  productSpecificationForOrder: {
    id: {
      type: 'string',
      required: false,
      description: 'Unique identifier of the product specification'
    },
    // based on cpq product spec, oms provisonSpecs
    describing: {
      type: 'describing',
      required: false,
      description:
        'The product provisionSpecs details, varies depending on the product and Seller, should get the spec when get a proidct offering'
    }
  },

  describing: {
    '@type': {
      description:
        'reference the provisionSpecs in the productOffering.\nWhen sub-classing, this defines the sub-class entity name.\nUsed when spec is described by value (litterally)\nCould be valued to UNIProductSpecification or ELineProductSpecification',
      type: 'string'
    }
  },

  productOrderResp: {
    id: {
      type: 'string',
      required: false,
      description: 'Unique identifier of the order'
    },
    deleted: {
      type: 'boolean',
      required: false,
      description: 'Order is deleted or not'
    },
    createdBy: {
      type: 'string',
      required: false
    },
    updatedBy: {
      type: 'string',
      required: false
    },
    deletedBy: {
      type: 'string',
      required: false
    },
    cancelledBy: {
      type: 'string',
      required: false
    },
    // createdAt
    orderDate: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    cancelledAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    externalId: {
      type: 'string',
      required: false,
      description:
        'ID given by the consumer and only understandable by him (to facilitate his searches afterwards)'
    },
    projectId: {
      type: 'string',
      required: false,
      description: 'ProjectId of the order if needed'
    },
    name: {
      type: 'string',
      required: false,
      description: 'Order name if needed'
    },
    description: {
      type: 'string',
      required: false,
      description: 'Description of the order if needed'
    },
    // not need for sonata, but need to send to oms
    companyId: {
      type: 'string',
      required: true,
      description: 'company id get from user management for OMS'
    },
    orderActivity: {
      type: 'string',
      enum: ['INSTALL', 'CHANGE', 'DISCONNECT'],
      required: false,
      // map to action, ADD
      description:
        'If orderActivity is set to INSTALL, all orderItemAction must be INSTALL'
    },
    state: {
      type: 'string',
      required: true,
      enum: [
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
        'COMPLETED'
      ]
    },
    completedAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    completedBy: {
      type: 'string',
      required: false
    },
    cancellationReason: {
      type: 'string',
      required: false,
      description:
        'An optional free-form text field for the Seller to provide additional information regarding the reason for the cancellation.'
    },
    billingType: {
      type: 'string',
      enum: ['PAYG', 'DOM'],
      required: false,
      default: 'PAYG',
      description: 'Ponder/Sherpa supported billingType'
    },
    paymentType: {
      type: 'string',
      enum: ['CREDITCARD', 'INVOICE'],
      required: false,
      default: 'CREDITCARD',
      description: 'Ponder/Sherpa supported paymentType'
    },
    orderItem: { type: 'array', required: true, itemType: 'orderItemResp' }
  },

  orderItemResp: {
    id: {
      type: 'string',
      required: false,
      description: 'Unique identifier of the product specification'
    },
    deleted: {
      type: 'boolean',
      required: false,
      description: 'Order is deleted or not'
    },
    createdBy: {
      type: 'string',
      required: false
    },
    updatedBy: {
      type: 'string',
      required: false
    },
    deletedBy: {
      type: 'string',
      required: false
    },
    cancelledBy: {
      type: 'string',
      required: false
    },
    // createdAt
    orderDate: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    deletedAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    cancelledAt: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    externalId: {
      type: 'string',
      required: false,
      description:
        'ID given by the consumer and only understandable by him (to facilitate his searches afterwards)'
    },
    action: {
      type: 'string',
      enum: ['INSTALL', 'CHANGE', 'DISCONNECT'],
      required: false,
      default: 'INSTALL',
      description:
        'If orderActivity is set to INSTALL, all orderItemAction must be INSTALL'
    },
    // quoteId
    quote: {
      type: 'quoteForOrder',
      required: true,
      description: 'quoteId obtained in the create quote process'
    },
    // productOfferingId
    productOffering: {
      type: 'productOfferingForOrder',
      required: true,
      description: 'productOfferingId obtained in the create quote process'
    },
    // need to add product
    product: {
      type: 'productForOrder',
      required: true,
      description:
        'One or more services sold to a Buyer by a Seller.  A particular Product Offering defines the technical and commercial attributes and behaviors of a Product.'
    },
    // two refids below used in "change" orders
    // refOrderId: {
    //   type: 'string',
    //   required: false,
    //   description:
    //     'Ponder/Sherpa reference order ID, reference to previous order to that need to be changed',
    // },
    // refOrderItemId: {
    //   type: 'string',
    //   required: false,
    //   description:
    //     'Ponder/Sherpa reference orderItem ID, reference to previous items to that need to be changed',
    // },
    state: {
      type: 'string',
      required: true,
      enum: [
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
        'COMPLETED'
      ]
    },
    orderItemPrice: {
      type: 'array',
      required: true,
      itemType: 'orderItemPrice'
    }
  },

  orderItemPrice: {
    priceType: {
      type: 'string',
      enum: ['RECURRING', 'NON_RECURRING'],
      required: false
    },
    recurringChargePeriod: {
      type: 'string',
      enum: ['DAY', 'WEEK', 'MONTH', 'YEAR'],
      required: false
    },
    name: { type: 'string', required: false },
    price: { type: 'price', required: false }
  },

  price: {
    dutyFreeAmount: { type: 'priceBlock', required: false }
  }
}
