'use strict'

const SonataBaseService = require('./sonataBackEnd')

const SITEMAP = {
  UNI: 'UNI Site',
  NNI: 'NNI Site'
}

class ProductInventoryService extends SonataBaseService {
  async inevSonataConverter (omsResObj) {
    return {
      id: omsResObj.id,
      status: omsResObj.state,
      startDate: omsResObj.startAt,
      lastUpdateDate: omsResObj.updatedAt,
      terminationDate: omsResObj.endAt,
      // only one site for now
      site: [
        {
          id: ['UNI', 'NNI'].includes(omsResObj.productType)
            ? omsResObj.details.dataCenterFacilityId
            : null,
          role: ['UNI', 'NNI'].includes(omsResObj.productType)
            ? SITEMAP[omsResObj.productType]
            : null,
          siteName: ['UNI', 'NNI'].includes(omsResObj.productType)
            ? omsResObj.details.dataCenterFacility.name
            : null,
          describing: omsResObj.details.dataCenterFacility
        }
      ],
      productOffering: {
        id: omsResObj.offeringId
      },
      productSpecification: {
        // no productSpecification from oms product
        id: null,
        describing: {
          ...omsResObj.provisionSpecs,
          productCode: omsResObj.productCode,
          productType: omsResObj.productType,
          productProvider: omsResObj.productProvider,
          provisionProcessId: omsResObj.provisionProcessId,
          terminateProcessId: omsResObj.terminateProcessId,
          provisionProcessInstanceId: omsResObj.provisionProcessInstanceId,
          terminateProcessInstanceId: omsResObj.terminateProcessInstanceId,
          thirdPartyDetails: omsResObj.details
        }
      },
      productOrder: [
        {
          // fake data, no order
          id: omsResObj.orderId,
          orderItemId: omsResObj.orderItemId
        }
      ],
      buyerProductId: omsResObj.buyerProductId
    }
  }

  async list (query) {
    this.ctx.logger.info('ProductInventory list payload: %j', query)
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
    // query.companyId = '72379d37-c66a-4c82-be56-9adcd4d02578';

    const res = await this.curl({
      service: 'oms',
      method: 'GET',
      endpoint: '/products/v1',
      payload: query
    })

    await Promise.all(
      res.data.map(async p => {
        const { companyId, resourceId, productProvider, productType } = p
        p.details = null
        if (
          companyId &&
          resourceId &&
          productType &&
          productProvider === 'CC'
        ) {
          if (productType === 'ELINE') {
            p.details = await this.ctx.service.consoleconnect.connection.findOne(
              p.companyId,
              resourceId
            )
          } else if (productType === 'UNI') {
            p.details = await this.ctx.service.consoleconnect.port.findOne(
              p.companyId,
              resourceId
            )
          }
        }
        return p
      })
    )
    // get total from payload
    this.ctx.set('X-Total-Count', res.size)

    if (Array.isArray(res.data)) {
      return await Promise.all(
        res.data.map(async obj => await this.inevSonataConverter(obj))
      )
    }
    return await this.inevSonataConverter(res.data)
  }

  async show (id) {
    this.ctx.logger.info('ProductInventory detail: %j', id)
    const res = await this.curl({
      service: 'oms',
      method: 'GET',
      endpoint: `/products/v1/${id}`
      // payload: query,
    })
    // res.companyId = '72379d37-c66a-4c82-be56-9adcd4d02578';

    const { companyId, resourceId, productProvider, productType } = res
    res.details = null
    try {
      if (companyId && resourceId && productType && productProvider === 'CC') {
        if (productType === 'ELINE') {
          res.details = await this.ctx.service.consoleconnect.connection.findOne(
            res.companyId,
            resourceId
          )
        } else if (productType === 'UNI') {
          res.details = await this.ctx.service.consoleconnect.port.findOne(
            res.companyId,
            resourceId
          )
        }
      }
    } catch (e) {
      this.ctx.logger.info('product instance:%j', res)
      this.ctx.logger.error('error on query product instance details:%j', e)
    }
    return await this.inevSonataConverter(res)
  }
}

module.exports = ProductInventoryService
