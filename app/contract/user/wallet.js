'use strict'

module.exports = {
  walletModel: {
    id: { type: 'string', required: true },
    provider: { type: 'string', required: true },
    address: { type: 'string', required: true },
    name: { type: 'string', required: false },
    description: { type: 'string', required: false },
    seed: { type: 'string', required: false },
    prvKey: { type: 'string', required: false },
    pubKey: { type: 'string', required: false },
    btype: { type: 'string', required: false },
    createdAt: { type: 'string', required: false }
  },

  wallet: {
    data: {
      type: 'walletModel',
      required: true
    }
  },

  walletList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'walletModel'
    },
    meta: { type: 'pageModel', required: true }
  },
  createWalletPayload: {
    provider: { type: 'string', required: true },
    address: { type: 'string', required: true },
    name: { type: 'string', required: false },
    description: { type: 'string', required: false },
    seed: { type: 'string', required: false },
    prvKey: { type: 'string', required: false },
    pubKey: { type: 'string', required: false },
    tType: { type: 'string', required: false }
  },

  updateWalletPayload: {
    provider: { type: 'string', required: true },
    address: { type: 'string', required: true },
    name: { type: 'string', required: false },
    description: { type: 'string', required: false },
    seed: { type: 'string', required: false },
    prvKey: { type: 'string', required: false },
    pubKey: { type: 'string', required: false },
    tType: { type: 'string', required: false }
  }
}
