'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller quote
 */
class QuoteController extends Controller {
  /**
   * @Summary List all quotes
   * @Router GET /mef/quoteManagement/v2/quote
   * @request query string externalId
   * @request query string productOfferingId
   * @request query string quoteItemId
   * @request query integer offset (N-1)*limit, 1 means 0 offset, 2 means 1*limit offset
   * @request query integer limit defualt:10
   * @Response 200 quoteResp OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      externalId: ctx.query.externalId,
      // cpq uses offeringId
      offeringId: ctx.query.productOfferingId,
      quoteItemId: ctx.query.quoteItemId,
      // cpq uses page and pagesize
      pageSize: ctx.helper.toInt(ctx.query.limit ? ctx.query.limit : 10),
      page: ctx.helper.toInt(ctx.query.offset ? ctx.query.offset : 1)
    }

    const data = await ctx.service.sonata.quote.list(query)

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize

    ctx.set('X-Total-Count', data.length)
    ctx.set('X-Result-Count', data.length)
    ctx.set('X-Offset', start)
    ctx.set('X-Limit', query.pageSize)

    ctx.body = _.slice(data, start, end)
  }

  /**
   * @Summary Get a quote by id
   * @Router GET /mef/quoteManagement/v2/quote/{id}
   * @Request path string *id
   * @Response 200 quoteResp OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const data = await ctx.service.sonata.quote.show(id)
    ctx.body = data
  }

  /**
   * @Summary Create a quote
   * @Router POST /mef/quoteManagement/v2/quote
   * @Request body createQuoteReq *body
   * @Response 201 quoteResp OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    // FIXME validation
    // ctx.validate(ctx.rule.createQuoteReq, ctx.request.body);

    const data = await ctx.service.sonata.quote.create(
      ctx.request.body
    )
    ctx.body = data
  }
}

module.exports = QuoteController
