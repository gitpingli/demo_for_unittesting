'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller Company Management
 */
class CompanyController extends Controller {
  /**
   * @Summary List all companies
   * @Router GET /companies
   * @Request query string name search company by name
   * @Request query string walletAddress search company by walletAddress
   * @Request query boolean deleted search company by deleted state
   * @Request query boolean filterEmptyWallet filter out company without wallet
   * @Request query string types filter company contains one of types
   * @Request query string consoleconnectEnabled
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 companyList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    const {
      name,
      walletAddress,
      deleted,
      filterEmptyWallet,
      consoleconnectEnabled
    } = ctx.query
    const { types } = ctx.queries
    const data = await ctx.service.ums.company.list({
      name,
      walletAddress,
      deleted,
      filterEmptyWallet,
      types,
      consoleconnectEnabled
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
   * @Summary Get a company by Id
   * @Router GET /companies/{id}
   * @Request path string *id
   * @Response 200 company OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.company.findOne(id)
    }
  }

  /**
   * @Summary Create a company
   * @Router POST /companies
   * @Request body createCompanyPayload *body
   * @Response 200 company OK
   * @Response 404 company not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createCompanyPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.ums.company.create(ctx.request.body)
    }
  }

  /**
   * @Summary Update a company
   * @Router PATCH /companies/{id}
   * @Request path string *id
   * @Request body updateCompanyPayload *body
   * @Response 200 company OK
   * @Response 404 company not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.validate(ctx.rule.updateCompanyPayload, ctx.request.body)
    ctx.body = {
      data: await ctx.service.ums.company.update(id, ctx.request.body)
    }
  }

  /**
   * @Summary Delete a company
   * @Router DELETE /companies/{id}
   * @Request path string *id
   * @Response 200 company OK
   * @Response 404 company not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.company.destroy(id)
    }
  }
}

module.exports = CompanyController
