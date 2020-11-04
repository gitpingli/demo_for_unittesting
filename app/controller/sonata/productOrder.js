'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller productOrder
 */
class ProductOrderController extends Controller {
  /**
   * @Summary List all productOrders
   * @Router GET /mef/productOrderManagement/v3/productOrder
   * @request query string externalId
   * @request query string productOfferingId
   * @request query string productId
   * @request query string state
   * @request query string productProvider
   * @request query integer offset (N-1)*limit, 1 means 0 offset, 2 means 1*limit offset
   * @request query integer limit defualt:10
   * @Response 200 productOrderResp OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      externalId: ctx.query.externalId,
      // oms uses offeringId
      offeringId: ctx.query.productOfferingId,
      productId: ctx.query.productId,
      // oms uses orderStateType
      orderStateType: ctx.query.state,
      productProvider: ctx.query.productProvider,
      // oms uses page and pagesize
      pageSize: ctx.helper.toInt(ctx.query.limit ? ctx.query.limit : 10),
      page: ctx.helper.toInt(ctx.query.offset ? ctx.query.offset : 1)
    }

    const data = await ctx.service.sonata.productOrder.list(query)

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    // ctx.set('X-Total-Count', data.length); set in service
    ctx.set('X-Result-Count', data.length)
    ctx.set('X-Offset', start)
    ctx.set('X-Limit', query.pageSize)

    ctx.body = _.slice(data, start, end)
  }

  /**
   * @Summary Get a productOrder by id
   * @Router GET /mef/productOrderManagement/v3/productOrder/{id}
   * @Request path string *id
   * @Response 200 productOrderResp OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const data = await ctx.service.sonata.productOrder.show(id)
    ctx.body = data
  }

  /**
   * @Summary Create a productOrder
   * @Router POST /mef/productOrderManagement/v3/productOrder
   * @Request body createProductOrderReq *body
   * @Response 201 productOrderResp OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    // ctx.validate(ctx.rule.productOrderResp, ctx.request.body);

    const data = await ctx.service.sonata.productOrder.create(ctx.request.body)
    ctx.body = data
  }
}

module.exports = ProductOrderController
