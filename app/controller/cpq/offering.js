'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Offering Management
 */
class ProductController extends Controller {
  /**
   * @Summary List all existing offerings
   * @Router GET /offerings
   * @Request query string provider
   * @Request query string type
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 offeringList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }
    const data = await ctx.service.cpq.offering.search(ctx.query)
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
   * @Summary Get a offering by Id
   * @Router GET /offerings/{id}
   * @Request path string *id
   * @Response 200 offering OK
   * @Response 404 offering not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.cpq.offering.findOne(id)
    }
  }
}

module.exports = ProductController
