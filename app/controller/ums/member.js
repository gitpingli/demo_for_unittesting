'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller Member Management
 */
class MemberController extends Controller {
  /**
   * @Summary List a company's members
   * @Router GET /companies/{companyId}/members
   * @Request path string *companyId
   * @Response 200 memberList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const { companyId } = ctx.params
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    ctx.logger.info('query:%j', query)
    const data = await ctx.service.ums.member.list(companyId)
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
   * @Summary Get a member by Id
   * @Router GET /companies/{companyId}/members/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Response 200 member OK
   * @Response 404 member not umsnd
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.member.findOne(companyId, id)
    }
  }

  /**
   * @Summary Add a member into company
   * @Router POST /companies/{companyId}/members
   * @Request path string *companyId
   * @Request body createMemberPayload *body
   * @Response 200 member OK
   * @Response 404 member not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    const { companyId } = ctx.params

    ctx.validate(ctx.rule.createMemberPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.ums.member.create(companyId, ctx.request.body)
    }
  }

  /**
   * @Summary Update a member
   * @Router PATCH /companies/{companyId}/members/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Request body updateMemberPayload *body
   * @Response 200 member OK
   * @Response 404 member not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.validate(ctx.rule.updateMemberPayload, ctx.request.body)
    ctx.body = {
      data: await ctx.service.ums.member.update(
        companyId,
        id,
        ctx.request.body
      )
    }
  }

  /**
   * @Summary Delete a member
   * @Router DELETE /companies/{companyId}/members/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Response 200 member OK
   * @Response 404 member not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.member.destroy(companyId, id)
    }
  }
}

module.exports = MemberController
