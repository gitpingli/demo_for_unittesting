'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Quote Management
 */
class QuoteController extends Controller {
  /**
   * @Summary Create a quote
   * @Router POST /quotes
   * @Request body createQuotePayload *body
   * @Response 200 quote OK
   * @Response 404 quote not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createQuotePayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.cpq.quote.create(ctx.request.body)
    }
  }

  /**
   * @Summary List all existing quotes
   * @Router GET /quotes
   * @Request query string companyId
   * @Request query string offeringId
   * @Request query string quoteItemId
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 quoteList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }
    const data = await ctx.service.cpq.quote.search(ctx.query)
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
   * @Summary Get a quote by Id
   * @Router GET /quotes/{id}
   * @Request path string *id
   * @Response 200 quote OK
   * @Response 404 quote not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.cpq.quote.findOne(id)
    }
  }
}

module.exports = QuoteController
