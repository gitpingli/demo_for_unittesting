'use strict'

module.exports = {
  productInventoryDetial: {
    id: {
      type: 'string',
      required: false,
      // from OMS
      description:
        'Unique identifier of the product instance in the product domain.'
    },
    status: {
      type: 'string',
      enum: [
        'ACTIVE',
        'SUSPENDED',
        'ACTIVEPENDINGTERMINATE',
        'TERMINATED',
        'PENDINGACTIVE',
        'SUSPENDEDPENDINGTERMINATE'
      ],
      required: false,
      default: 'ACTIVE',
      description:
        'The state of the product in accordance with the product lifecycle.'
    },
    startDate: {
      type: 'string',
      format: 'date-time',
      required: false,
      description:
        'Start date is when the product is active for the first time (when the install in the product order has been processed).'
    },
    lastUpdateDate: {
      type: 'string',
      format: 'date-time',
      required: false,
      description: 'Latest date when the product has been updated'
    },
    terminationDate: {
      type: 'string',
      format: 'date-time',
      required: false,
      description:
        'Termination date (commercial) is when the product has been terminated (when the disconnect in the product order has been processed).'
    },
    site: {
      type: 'array',
      required: true,
      itemType: 'siteInInventory',
      description: 'A geographic site related to the product. DCF in CC'
    },
    productOffering: {
      type: 'productOfferingInInventory',
      required: false,
      description:
        'The commercial and technical details of a Product sold by a particular Seller. A Product Offering defines all of the commercial terms and, through association with a particular Product Specification, defines all the technical attributes and behaviors of the Product. A Product Offering may constrain the allowable set of configurable technical attributes and/or behaviors specified in the associated Product Specification'
    },
    productSpecification: {
      type: 'productSpecificationInInventory',
      required: false,
      description:
        'A structured set of well-defined technical attributes and/or behaviors that are used to construct a Product Offering for sale to a market.'
    },
    productOrder: {
      type: 'array',
      required: false,
      itemType: 'productOrderInInventory',
      description:
        'A reference to a productOrder and optionally to an order item.'
    },
    buyerProductId: {
      type: 'string',
      required: false,
      description: 'Buyer product Id - informative information'
    }
  },

  siteInInventory: {
    id: {
      type: 'string',
      required: false,
      description: 'Unique identifier of the Site. DCF id in CC'
    },
    role: {
      type: 'string',
      required: false,
      description:
        'The role that the Site plays, e.g. "Billing Address", "UNI Site", or "ENNI Site".'
    },
    siteName: {
      type: 'string',
      required: false,
      description: 'Name of the Site.'
    },
    describing: {
      type: 'describing',
      required: false,
      description: 'A technical attribute to extend the class'
    }
  },

  productOfferingInInventory: {
    id: {
      type: 'string',
      required: false,
      description:
        'A unique product offering identifier. This identifier is provided by the seller'
    }
  },

  productSpecificationInInventory: {
    id: {
      type: 'string',
      required: false,
      description: 'A unique identifier of the product spec'
    },
    // based on cpq product spec, oms provisonSpecs
    describing: {
      type: 'describing',
      required: false,
      description: 'Technical structure to describe productSpecification'
    }
  },

  describing: {
    '@type': {
      description: 'Type of the resource',
      type: 'string'
    }
  },

  productOrderInInventory: {
    id: {
      type: 'string',
      required: false,
      description: 'Identifier of the productOrder(provided by the seller)'
    },
    orderItemId: {
      type: 'string',
      required: false,
      description:
        'Identifier of the line item (generally it is a sequence number 01, 02, 03, ...)'
    }
  }
}
