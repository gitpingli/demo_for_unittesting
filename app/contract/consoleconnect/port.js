'use strict'

module.exports = {
  dataCenterFacilityModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true }
  },
  metroModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    country: { type: 'string', required: true }
  },
  portCapacity: {
    total: {
      type: 'integer',
      required: true
    },
    utilised: {
      type: 'integer',
      required: true
    },
    remaining: {
      type: 'integer',
      required: true
    }
  },
  portSpeed: {
    name: { type: 'string', required: true },
    value: {
      type: 'integer',
      required: true
    }
  },
  portModel: {
    id: { type: 'string', required: true },
    companyId: { type: 'string', required: true },
    speed: {
      type: 'portSpeed',
      required: true
    },
    status: {
      type: 'string',
      required: true,
      enum: [
        'ACTIVE',
        'DISABLED',
        'ACTIVATING',
        'DISABLING',
        'DELETING',
        'DELETED',
        'UNKNOWN'
      ]
    },
    capacity: {
      type: 'portCapacity',
      required: true
    },

    paymentType: { type: 'string', required: true },
    payg: { type: 'boolean', required: true },
    metro: { type: 'metroModel', required: true },
    dataCenterFacility: { type: 'dataCenterFacilityModel', required: true }
  },

  port: {
    data: {
      type: 'portModel',
      required: true
    }
  },

  portList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'portModel'
    },
    meta: { type: 'pageModel', required: true }
  }
}
