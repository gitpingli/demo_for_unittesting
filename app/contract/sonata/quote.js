'use strict'

module.exports = {
  createQuoteReq: {
    // buyer: { type: 'string', required: true },
    externalId: {
      type: 'string',
      required: true,
      description:
        'ID given by the consumer and only understandable by him (to facilitate his searches afterwards)'
    },
    quoteLevel: {
      type: 'string',
      enum: ['FIRM', 'BUDGETARY', 'INDICATIVE'],
      required: false,
      default: 'FIRM',
      description:
        'Level of the quote - could be indicative, budgetary or firm'
    },
    instantSyncQuoting: {
      type: 'boolean',
      default: true,
      required: false,
      description:
        'If this flag is set to true, Buyer requests to have instant quoting to be provided in operation POST response'
    },
    relatedParty: {
      type: 'array',
      required: false,
      itemType: 'relatedParty',
      description: 'Company or buyer required by CPQ'
    },
    quoteItem: {
      type: 'array',
      required: true,
      itemType: 'quoteItemReq',
      description:
        ' A quote items describe an action to be performed on a productOffering or a product in order to get pricing elements and condition'
    }
  },

  relatedParty: {
    id: {
      type: 'string',
      required: false,
      description:
        'Unique identifier of a related party, companyId required by CPQ'
    },
    role: {
      type: 'string',
      required: false,
      description: 'Role of the related party for this quote or quoteItem'
    },
    name: {
      type: 'string',
      required: false,
      description: 'Name of the related party'
    }
  },

  quoteItemReq: {
    // buyer provided
    id: {
      type: 'string',
      required: false,
      description:
        'Identifier of the quote item (generally it is a sequence number 01, 02, 03, ...), set by Buyer'
    },
    action: {
      type: 'string',
      enum: ['INSTALL', 'CHANGE', 'DISCONNECT'],
      required: true,
      description: 'Action to be performed on the product'
    },
    productOffering: {
      type: 'productOffering',
      required: false,
      description:
        'The commercial and technical details of a Product sold by a particular Seller.  A Product Offering defines all of the commercial terms and, through association with a particular Product Specification, defines all the technical attributes and behaviors of the Product. A Product Offering may constrain the allowable set of configurable technical attributes and/or behaviors specified in the associated Product Specification'
    },
    product: {
      type: 'product',
      required: false,
      description:
        'One or more services sold to a Buyer by a Seller.  A particular Product Offering defines the technical and commercial attributes and behaviors of a Product.'
    }
    // quoteItemPrice: {
    //   type: 'array',
    //   required: true,
    //   itemType: 'itemPrice',
    //   description: 'Quote the price based on item charge method',
    // },
  },

  // itemPrice: {
  //   priceType: {
  //     type: 'string',
  //     enum: ['RECURRING', 'NON_RECURRING'],
  //     required: false,
  //   },
  //   recurringChargePeriod: {
  //     type: 'string',
  //     enum: ['DAY', 'WEEK', 'MONTH', 'YEAR'],
  //     required: false,
  //   },
  //   name: { type: 'string', required: false },
  // },

  // cpq offering id
  productOffering: {
    id: {
      type: 'string',
      required: true,
      description: 'Unique identifier of the product offering from CPQ'
    }
  },

  duration: {
    value: { type: 'integer', required: true },
    unit: {
      type: 'string',
      enum: ['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'],
      required: true
    }
  },

  product: {
    id: {
      type: 'string',
      required: false,
      description:
        'Identifier of the quote item (generally it is a sequence number 01, 02, 03, ...), set by Buyer'
    },
    productSpecification: { type: 'productSpecification', required: true }
  },

  productSpecification: {
    id: {
      type: 'string',
      required: false,
      description:
        'Identifier of the quote item (generally it is a sequence number 01, 02, 03, ...), set by Buyer'
    },
    // based on cpq product spec
    describing: {
      type: 'describing',
      required: true,
      description:
        'reference the quoteSpecs in the productOffering, varies depending on the product and Seller'
    }
  },

  describing: {
    '@type': {
      description:
        'reference the quoteSpecs in the productOffering.\nWhen sub-classing, this defines the sub-class entity name.\nUsed when spec is described by value (litterally)\nCould be valued to UNIProductSpecification or ELineProductSpecification',
      type: 'string'
    }
    //
    // bandwidth: { type: 'integer', required: false },
    // classOfService: {
    //   type: 'string',
    //   enum: [ 'BRONZE', 'SLIVER', 'SILVERPLUS', 'GOLD' ],
    //   default: 'BRONZE',
    //   required: false,
    // },
    // duration: { type: 'duration', required: false },
    // srcLocationId: { type: 'string', required: false },
    // destLocationId: { type: 'string', required: false },
  },

  quoteResp: {
    id: { type: 'string', required: true },
    // buyer: { type: 'string', required: true },
    externalId: { type: 'string', required: true },
    // description: { type: 'string', required: false },
    state: {
      type: 'string',
      enum: [
        'IN_PROGRESS',
        'CANCELLED',
        'UNABLE_TO_PROVIDE',
        'READY',
        'REJECTED',
        'ACCEPTED',
        'EXPIRED'
      ],
      required: true
    },
    quoteDate: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    quoteLevel: {
      type: 'string',
      enum: ['FIRM', 'BUDGETARY', 'INDICATIVE'],
      required: false,
      default: 'FIRM'
    },
    instantSyncQuoting: { type: 'boolean', default: true, required: false },
    effectiveQuoteCompletionDate: {
      type: 'string',
      format: 'date-time',
      required: false,
      description: 'Date when the quoted was Cancelled or Rejected or Accepted'
    },
    // validFor: { type: 'validFor', required: true },
    quoteItem: { type: 'array', required: true, itemType: 'quoteItemResp' }
  },

  validFor: {
    startDate: {
      type: 'string',
      format: 'date-time',
      required: false
    },
    endDate: {
      type: 'string',
      format: 'date-time',
      required: false
    }
  },
  quoteItemResp: {
    // buyer provided
    id: { type: 'string', required: true },
    state: {
      type: 'string',
      enum: ['IN_PROGRESS', 'UNABLE_TO_PROVIDE', 'REDAY', 'ABANDONED'],
      required: true
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
      required: true
    },
    productOffering: { type: 'productOffering', required: true },
    product: { type: 'product', required: true },
    validFor: { type: 'validFor', required: true },
    preCalculatedPrice: { type: 'quoteItemPrice', required: true },
    quoteItemPrice: {
      type: 'array',
      required: true,
      itemType: 'quoteItemPrice'
    }
  },

  quoteItemPrice: {
    priceType: {
      type: 'string',
      enum: ['RECURRING', 'NON_RECURRING'],
      required: true
    },
    recurringChargePeriod: {
      type: 'string',
      enum: ['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'],
      required: true
    },
    name: { type: 'string', required: true },
    price: { type: 'price', required: true }
  },

  price: {
    preTaxAmount: { type: 'priceBlock', required: true }
  },

  priceBlock: {
    value: { type: 'integer', required: true },
    unit: { type: 'string', required: true }
  }
}
