'use strict'

module.exports = {
  addressModel: {
    telephone: { type: 'string', required: false },
    address: { type: 'string', required: true },
    city: { type: 'string', required: true },
    state: { type: 'string', required: true },
    country: { type: 'string', required: true },
    zip: { type: 'string', required: true }
  },

  companyModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    emailDomain: { type: 'string', required: true },
    website: { type: 'string', required: true },
    industryType: { type: 'string', required: true },
    types: { type: 'array', required: true, itemType: 'string' },
    wallets: { type: 'array', required: false, itemType: 'walletModel' },
    externalSystems: {
      type: 'array',
      required: false,
      itemType: 'externalModel'
    },
    avatar: { type: 'string', required: false },
    deleted: { type: 'boolean', required: false },
    createdAt: { type: 'string', required: false },
    createdBy: { type: 'string', required: false },
    updatedAt: { type: 'string', required: false },
    updatedBy: { type: 'string', required: false },
    deletedAt: { type: 'string', required: false },
    deletedBy: { type: 'string', required: false }
  },

  company: {
    data: {
      type: 'companyModel',
      required: true
    }
  },
  companyList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'companyModel'
    },
    meta: { type: 'pageModel', required: true }
  },

  createCompanyPayload: {
    name: { type: 'string', required: true },
    emailDomain: { type: 'string', required: true },
    website: { type: 'string', required: true },
    industryType: { type: 'string', required: true },
    wallets: {
      type: 'array',
      required: false,
      itemType: 'createWalletPayload'
    },
    externalSystems: {
      type: 'array',
      required: false,
      itemType: 'createExternalPayload'
    },
    types: { type: 'array', required: true, itemType: 'string' },
    address: { type: 'addressModel', required: false },
    consoleconnectEnabled: { type: 'boolean', required: false }
  },
  updateCompanyPayload: {
    name: { type: 'string', required: false },
    emailDomain: { type: 'string', required: false },
    website: { type: 'string', required: false },
    industryType: { type: 'string', required: false },
    types: { type: 'array', required: false, itemType: 'string' },
    wallet: { type: 'array', required: false, itemType: 'createWalletPayload' }
  }
}
