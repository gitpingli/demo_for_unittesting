'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller productOffering
 */
class ProductOfferingController extends Controller {
  /**
   * @Summary List productOfferings
   * @Router GET /mef/productOfferingManagement/v1/productOffering
   * @request query string provider
   * @request query string type
   * @request query boolean deleted
   * @request query integer offset (N-1)*limit, 1 means 0 offset, 2 means 1*limit offset
   * @request query integer limit defualt:10
   * @Response 200  OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      provider: ctx.query.provider,
      type: ctx.query.type,
      deleted: ctx.query.deleted,
      // cpq uses page and pagesize
      pageSize: ctx.helper.toInt(ctx.query.limit ? ctx.query.limit : 10),
      page: ctx.helper.toInt(ctx.query.offset ? ctx.query.offset : 1)
    }

    const data = await ctx.service.sonata.productOffering.list(query)

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize

    ctx.set('X-Total-Count', data.length)
    ctx.set('X-Result-Count', data.length)
    ctx.set('X-Offset', start)
    ctx.set('X-Limit', query.pageSize)

    ctx.body = _.slice(data, start, end)
  }

  /**
   * @Summary Get a productOffering by id
   * @Router GET /mef/productOfferingManagement/v1/productOffering/{id}
   * @Request path string *id
   * @Response 200  OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const data = await ctx.service.sonata.productOffering.show(id)
    ctx.body = data
  }

  /**
   * @Summary Get providers of productOfferings
   * @Router GET /mef/productOfferingManagement/v1/providers
   * @request query string code
   * @request query boolean deleted
   * @request query integer offset (N-1)*limit, 1 means 0 offset, 2 means 1*limit offset
   * @request query integer limit defualt:10
   * @Response 200  OK
   * @Response 500 error Unknown internal server error
   */
  async getOfferingProviders () {
    const { ctx } = this

    const query = {
      code: ctx.query.code,
      deleted: ctx.query.deleted,
      pageSize: ctx.helper.toInt(ctx.query.limit ? ctx.query.limit : 10),
      page: ctx.helper.toInt(ctx.query.offset ? ctx.query.offset : 1)
    }

    const data = await ctx.service.sonata.productOffering.getOfferingProviders(
      query
    )

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize

    ctx.set('X-Total-Count', data.length)
    ctx.set('X-Result-Count', data.length)
    ctx.set('X-Offset', start)
    ctx.set('X-Limit', query.pageSize)

    ctx.body = _.slice(data, start, end)
  }
}

module.exports = ProductOfferingController
