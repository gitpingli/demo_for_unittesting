'use strict'

const SonataBaseService = require('./sonataBackEnd')

const Q2SMAP = {
  PRC: 'RECURRING',
  OTC: 'NON_RECURRING',
  UBC: 'NON_RECURRING'
}

class QuoteService extends SonataBaseService {
  async quoteSonataConverter (cpqResObj) {
    return {
      id: cpqResObj.id,
      externalId: cpqResObj.externalId,
      state: cpqResObj.items[0].state, // first one in item
      quoteDate: cpqResObj.createdAt,
      quoteLevel: 'FIRM',
      instantSyncQuoting: true,
      effectiveQuoteCompletionDate: cpqResObj.createdAt,
      // validFor: {
      //   startDate: '2020-05-29T02:52:09.246Z',
      //   endDate: '2020-05-29T02:52:09.246Z',
      // },
      quoteItem: cpqResObj.items.map(item => {
        return {
          id: item.id,
          state: item.state,
          externalId: item.externalId,
          productOffering: {
            id: item.offeringId
          },
          product: {
            // no id
            productSpecification: {
              describing: item.specs
            }
          },
          validFor: {
            startDate: item.validFor.start,
            endDate: item.validFor.end
          },
          preCalculatedPrice: {
            priceType: Q2SMAP[item.price.type],
            // recurringChargePeriod: 'DAY',
            price: {
              preTaxAmount: {
                value: item.price.amount,
                unit: item.price.currency
              }
            }
          },
          quoteItemPrice: item.prices.map(p => {
            return {
              priceType: Q2SMAP[p.type],
              recurringChargePeriod: p.period,
              price: {
                preTaxAmount: {
                  value: p.amount,
                  unit: p.currency
                }
              }
            }
          })
        }
      })
    }
  }

  async list (query) {
    this.ctx.logger.info('Quote list payload: %j', query)

    const companyId = this.ctx.user.companyId
    if (!companyId) {
      this.ctx.throw(400, 'No company')
    }
    // trim undefined
    Object.keys(query).forEach(
      key => [undefined].includes(query[key]) && delete query[key]
    )
    // add companyId in the query
    query.companyId = companyId

    // sonata converter
    const res = await this.curl({
      service: 'cpq',
      method: 'GET',
      endpoint: '/quotes',
      payload: query
    })
    if (Array.isArray(res)) {
      return await Promise.all(
        res.map(async obj => await this.quoteSonataConverter(obj))
      )
    }
    // return res
    return await this.quoteSonataConverter(res)
  }

  async show (id) {
    this.ctx.logger.info('Quote detail: %j', id)
    // sonata converter
    const res = await this.curl({
      service: 'cpq',
      method: 'GET',
      endpoint: `/quotes/${id}`
      // payload: query,
    })
    return await this.quoteSonataConverter(res)
  }

  async create (payload) {
    this.ctx.logger.info('Quote create payload: %j', payload)
    const companyId = this.ctx.user.companyId
    if (!companyId) {
      this.ctx.throw(400, 'No company')
    }

    const cpqReq = {
      companyId,
      externalId: payload.externalId || null,
      projectId: payload.projectId || null,
      // name: payload.name || null,
      items: payload.quoteItem.map(item => {
        return {
          externalId: item.id || null,
          projectId: payload.projectId || null,
          offeringId: item.productOffering.id,
          action: item.action,
          specs: item.product.productSpecification.describing
        }
      })
    }
    this.ctx.logger.info('Quote CPQ create payload: %j', cpqReq)

    // sonata converter
    const res = await this.curl({
      service: 'cpq',
      method: 'POST',
      endpoint: '/quotes',
      payload: cpqReq
    })
    return await this.quoteSonataConverter(res)
  }
}

module.exports = QuoteService
