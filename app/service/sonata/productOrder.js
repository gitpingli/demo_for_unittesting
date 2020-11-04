'use strict'

const SonataBaseService = require('./sonataBackEnd')

const S2OMAP = {
  INSTALL: 'ADD',
  CHANGE: 'UPDATE',
  DISCONNECT: 'REMOVE'
}

const O2SMAP = {
  ADD: 'INSTALL',
  UPDATE: 'CHANGE',
  REMOVE: 'DISCONNECT'
}

class ProductOrderService extends SonataBaseService {
  async orderSonataConverter (omsResObj) {
    return {
      id: omsResObj.id,
      deleted: omsResObj.deleted,
      createdBy: omsResObj.createdBy,
      updatedBy: omsResObj.updatedBy,
      deletedBy: omsResObj.deletedBy,
      cancelledBy: omsResObj.cancelledBy,
      orderDate: omsResObj.createdAt,
      updatedAt: omsResObj.updatedAt,
      deletedAt: omsResObj.deletedAt,
      cancelledAt: omsResObj.cancelledAt,
      externalId: omsResObj.externalId,
      projectId: omsResObj.projectId,
      name: omsResObj.name,
      description: omsResObj.description,
      companyId: omsResObj.companyId,
      orderActivity: O2SMAP[omsResObj.action],
      state: omsResObj.state,
      completedAt: omsResObj.completedAt,
      completedBy: omsResObj.completedBy,
      cancellationReason: omsResObj.cancellationReason,
      billingType: omsResObj.billingType,
      paymentType: omsResObj.paymentType,
      orderItem: omsResObj.items.map(item => {
        return {
          id: item.id,
          deleted: item.deleted,
          createdBy: item.createdBy,
          updatedBy: item.updatedBy,
          deletedBy: item.deletedBy,
          cancelledBy: item.cancelledBy,
          orderDate: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
          cancelledAt: item.cancelledAt,
          externalId: item.externalId,
          action: O2SMAP[item.action],
          quote: {
            // no id
            quoteItem: item.quoteId
          },
          productOffering: {
            id: item.offeringId
          },
          product: {
            id: item.productInstanceId,
            buyerProductId: item.buyerProductId,
            productSpecification: {
              // id: 'string',
              describing: item.provisionSpecs
            }
          },
          // refOrderId: item.refOrderId,
          // refOrderItemId: item.refOrderItemId,
          state: item.state,
          orderItemPrice: [
            {
              // priceType: 'RECURRING',
              // recurringChargePeriod: 'DAY',
              // name: 'string',
              price: {
                dutyFreeAmount: {
                  value: item.totalAmount,
                  unit: item.currency
                }
              }
            }
          ]
        }
      })
    }
  }

  async list (query) {
    this.ctx.logger.info('ProductOrder list payload: %j', query)

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
    // query.companyId = 'a27e031a-27c6-4378-8464-35be8d899502';

    const res = await this.curl({
      service: 'oms',
      method: 'GET',
      endpoint: '/orders/v1',
      payload: query
    })
    // get total from payload
    this.ctx.set('X-Total-Count', res.size)

    if (Array.isArray(res.data)) {
      return await Promise.all(
        res.data.map(async obj => await this.orderSonataConverter(obj))
      )
    }
    return await this.orderSonataConverter(res.data)
  }

  async show (id) {
    this.ctx.logger.info('ProductOrder detail: %j', id)
    const res = await this.curl({
      service: 'oms',
      method: 'GET',
      endpoint: `/orders/v1/${id}`
      // payload: query,
    })

    return await this.orderSonataConverter(res)
  }

  async create (payload) {
    this.ctx.logger.info('ProductOrder create payload: %j', payload)
    const companyId = this.ctx.user.companyId
    if (!companyId) {
      this.ctx.throw(400, 'No company')
    }

    const omsReq = {
      name: payload.name,
      description: payload.description,
      companyId,
      externalId: payload.externalId || null,
      projectId: payload.projectId,
      action: Object.prototype.hasOwnProperty.call(payload, 'orderActivity')
        ? S2OMAP[payload.orderActivity]
        : 'ADD',
      items: payload.orderItem.map(item => {
        return {
          externalId: item.id || null,
          buyerProductId: item.product.buyerProductId,
          action: Object.prototype.hasOwnProperty.call(item, 'action') ? S2OMAP[item.action] : 'ADD',
          quoteId: item.quote.quoteItem,
          offeringId: item.productOffering.id,
          provisionSpecs: item.product.productSpecification.describing,
          productInstanceId: item.product.id || null
          // refOrderId: item.refOrderId || null,
          // refOrderItemId: item.refOrderItemId || null,
        }
      }),
      billingType: payload.billingType || 'PAYG',
      paymentType: payload.paymentType || 'CREDITCARD',
      ready: true
    }

    this.ctx.logger.info('ProductOrder OMS create payload: %j', omsReq)

    const res = await this.curl({
      service: 'oms',
      method: 'POST',
      endpoint: '/orders/v1',
      payload: omsReq
    })
    // sonata converter for order
    return await this.orderSonataConverter(res)
  }
}

module.exports = ProductOrderService
