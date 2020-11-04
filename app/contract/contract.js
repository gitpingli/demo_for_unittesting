'use strict'

module.exports = {
  contractModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    description: { type: 'string', required: true },
    deleted: { type: 'boolean', required: true }
  },

  contractService: {
    id: { type: 'string', required: true },
    mcc: { type: 'string', required: true },
    mnc: { type: 'string', required: true },
    unitPrice: { type: 'string', required: true },
    totalAmount: { type: 'string', required: true },
    currency: { type: 'string', required: true }
  },
  createContractPayload: {
    type: { type: 'string', required: true },
    parties: { type: 'array', required: true, itemType: 'string' },
    services: { type: 'array', required: true, itemType: 'contractService' },
    validStart: { type: 'string', required: true },
    validEnd: { type: 'string', required: true }
  },

  contract: {
    data: { type: 'contractModel', required: true }
  }
}
