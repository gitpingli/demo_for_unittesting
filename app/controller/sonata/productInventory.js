'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller productInventory
 */
class ProductInventoryController extends Controller {
  /**
   * @Summary List all productInventory
   * @Router GET /mef/productInventoryManagement/v3/product
   * @request query string productOrderId
   * @request query string productProvider
   * @request query string buyerProductId
   * @request query integer offset (N-1)*limit, 1 means 0 offset, 2 means 1*limit offset
   * @request query integer limit defualt:10
   * @Response 200 productInventoryDetial OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      orderId: ctx.query.productOrderId,
      offeringId: ctx.query.porductOfferingId,
      productProvider: ctx.query.productProvider,
      buyerProductId: ctx.query.buyerProductId,
      // oms uses page and pagesize
      pageSize: ctx.helper.toInt(ctx.query.limit ? ctx.query.limit : 10),
      page: ctx.helper.toInt(ctx.query.offset ? ctx.query.offset : 1)
    }

    const data = await ctx.service.sonata.productInventory.list(query)

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    // ctx.set('X-Total-Count', data.length); set in service
    ctx.set('X-Result-Count', data.length)
    ctx.set('X-Offset', start)
    ctx.set('X-Limit', query.pageSize)

    ctx.body = _.slice(data, start, end)
  }

  /**
   * @Summary Get a productInventory by id
   * @Router GET /mef/productInventoryManagement/v3/product/{id}
   * @Request path string *id
   * @Response 200 productInventoryDetial OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const data = await ctx.service.sonata.productInventory.show(id)
    ctx.body = data
  }
}

module.exports = ProductInventoryController
