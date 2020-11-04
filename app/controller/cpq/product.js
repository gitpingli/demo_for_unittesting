'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Product Management
 */
class ProductController extends Controller {
  /**
   * @Summary List all existing products
   * @Router GET /products
   * @Request query string code
   * @Request query string provider
   * @Request query string type
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 productList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }
    const data = await ctx.service.cpq.product.search(ctx.query)
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
   * @Summary Get a product by Id
   * @Router GET /products/{id}
   * @Request path string *id
   * @Response 200 product OK
   * @Response 404 product not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.cpq.product.findOne(id)
    }
  }
}

module.exports = ProductController
