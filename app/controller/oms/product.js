'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller ProductInstance Management
 */
class ProductController extends Controller {
  /**
   * @Summary List all existing productInstance
   * @Router GET /productInstances
   * @Request query string companyId consolecore company id
   * @Request query string productId productId definied in CPQ
   * @Request query string productProvider provider definied in CPQ
   * @Request query string orderId orderId definied in OMS
   * @Request query string buyerProductId buyerProductId definied in OMS
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 productInstanceList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }
    const { companyId, productId, productProvider, orderId, buyerProductId } = ctx.query
    const data = await ctx.service.oms.product.search({
      companyId,
      productId,
      productProvider,
      orderId,
      buyerProductId
    })
    const meta = {
      total: data.length,
      page: query.page,
      per_page: query.pageSize
    }
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    ctx.body = {
      data: _.slice(data, start, end),
      meta
    }
  }

  /**
   * @Summary Get a productInstance by Id
   * @Router GET /productInstances/{id}
   * @Request path string *id
   * @Response 200 productInstance OK
   * @Response 404
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.oms.product.findOne(id)
    }
  }
}

module.exports = ProductController
