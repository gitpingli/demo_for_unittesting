'use strict'

module.exports = {
  utilizationItem: {
    time: {
      type: 'number'
    },
    rxMin: {
      type: 'number'
    },
    rxMax: {
      type: 'number'
    },
    rxAverage: {
      type: 'number'
    },
    txMin: {
      type: 'number'
    },
    txMax: {
      type: 'number'
    },
    txAverage: {
      type: 'number'
    }
  },
  utilizationModel: {
    unit: {
      type: 'string',
      enum: ['Mbps'],
      required: true
    },
    results: {
      type: 'array',
      required: true,
      itemType: 'utilizationItem'
    }
  },

  utilization: {
    data: {
      type: 'utilizationModel',
      required: true
    }
  }
}
