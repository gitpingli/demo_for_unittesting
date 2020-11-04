'use strict'

module.exports = {
  quotePrice: {
    amount: { type: 'number', required: true },
    type: { type: 'string', required: true, enum: ['PRC', 'OTC', 'UBC'] },
    currency: { type: 'string', required: true },
    period: { type: 'string', required: false, enum: ['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] }
  },
  quoteModel: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    companyId: { type: 'string', required: true },
    externalId: { type: 'string', required: false },
    projectId: { type: 'string', required: false },
    state: {
      type: 'string',
      required: true,
      enum: [
        'IN_PROGRESS',
        'READY',
        'CANCELLED',
        'REJECTED',
        'ACCEPTED',
        'EXPIRED',
        'UNABLE_TO_PROVIDE',
        'INSUFICIENT_INFORMATION_PROVIDED']
    },

    createdAt: { type: 'string', required: true },
    createdBy: { type: 'string', required: true },

    items: {
      type: 'array',
      required: true,
      itemType: 'quoteItem'
    }
  },

  quoteItem: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: false },
    companyId: { type: 'string', required: true },
    externalId: { type: 'string', required: false },
    projectId: { type: 'string', required: false },
    offeringId: { type: 'string', required: true },
    state: {
      type: 'string',
      required: true,
      enum: [
        'IN_PROGRESS',
        'UNABLE_TO_PROVIDE',
        'READY',
        'ABANDONED',
        'INSUFICIENT_INFORMATION_PROVIDED']
    },

    price: { type: 'quotePrice', required: true },
    prices: { type: 'array', erquired: false, itemType: 'quotePrice' },

    createdAt: { type: 'string', required: true },
    createdBy: { type: 'string', required: true }
  },

  quote: {
    data: {
      type: 'quoteModel',
      required: true
    }
  },

  quoteList: {
    data: {
      type: 'array',
      required: true,
      itemType: 'quoteModel'
    },
    meta: { type: 'pageModel', required: true }
  },

  createQuoteItemPayload: {
    externalId: { type: 'string', required: false },
    projectId: { type: 'string', required: false },
    offeringId: { type: 'string', required: true },
    specs: {
      type: 'object',
      required: true
    }
  },
  createQuotePayload: {
    companyId: { type: 'string', required: true },
    name: { type: 'string', required: false },
    externalId: { type: 'string', required: false },
    projectId: { type: 'string', required: false },
    items: {
      type: 'array',
      required: true,
      itemType: 'createQuoteItemPayload'
    }

  }
}
