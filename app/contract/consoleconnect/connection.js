'use strict'

module.exports = {
  connectionModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    speed: {
      type: 'portSpeed',
      required: true
    },
    status: {
      type: 'string',
      required: true,
      enum: [
        'PENDING',
        'CANCELLED',
        'DENIED',
        'ACCEPTED',
        'PENDING_ACCEPTANCE',
        'CREATING',
        'ACTIVATING',
        'ACTIVE',
        'DISABLING',
        'DISABLED',
        'DELETING',
        'DELETED',
        'ERROR',
        'MANUAL'
      ]
    },

    type: {
      type: 'string',
      required: true,
      enum: ['LAYER2', 'LAYER3', 'LAYER2_DCP', 'LAYER3_DCP', 'GROUP_LAYER2']
    },

    durationUnit: {
      type: 'string',
      required: true,
      enum: ['d', 'w', 'm', 'y']
    },
    duration: { type: 'integer', required: true },
    classOfService: {
      type: 'string',
      required: true,
      enum: ['GOLD', 'SILVERPLUS', 'SILVER', 'BRONZE']
    },

    srcPortId: { type: 'string', required: true },
    destPortId: { type: 'string', required: true },
    srcCompanyId: { type: 'string', required: true },
    destCompanyId: { type: 'string', required: true },
    srcRegionId: { type: 'string', required: true },
    destRegionId: { type: 'string', required: true },

    paymentType: { type: 'string', required: true },
    payg: { type: 'boolean', required: true }
  },

  connection: {
    data: {
      type: 'connectionModel',
      required: true
    }
  },

  connectionList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'connectionModel'
    },
    meta: { type: 'pageModel', required: true }
  }
}
