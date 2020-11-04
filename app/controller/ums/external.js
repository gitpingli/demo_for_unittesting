'use strict'

const Controller = require('egg').Controller

/**
 * @Controller External Management
 */
class ExternalController extends Controller {
  /**
   * @Summary List a company's external systems
   * @Router GET /companies/{companyId}/externals
   * @Request path string *companyId
   * @Response 200 company OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const { companyId } = ctx.params

    const data = await ctx.service.ums.external.list(companyId)
    const meta = {
      total: data.length,
      page: 1,
      per_page: 100
    }
    ctx.body = {
      data,
      meta
    }
  }

  /**
   * @Summary Get a external by Id
   * @Router GET /companies/{companyId}/externals/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Response 200 externalList OK
   * @Response 404 external not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.external.findOne(companyId, id)
    }
  }

  /**
   * @Summary Add a external into company
   * @Router POST /companies/{companyId}/externals
   * @Request path string *companyId
   * @Request body createExternalPayload *body
   * @Response 200 external OK
   * @Response 404 external not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    const { companyId } = ctx.params

    ctx.validate(ctx.rule.createExternalPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.ums.external.create(companyId, ctx.request.body)
    }
  }

  /**
   * @Summary Update a external
   * @Router PATCH /companies/{companyId}/externals/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Request body updateExternalPayload *body
   * @Response 200 external OK
   * @Response 404 external not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.validate(ctx.rule.updateExternalPayload, ctx.request.body)
    ctx.body = {
      data: await ctx.service.ums.external.update(
        companyId,
        id,
        ctx.request.body
      )
    }
  }

  /**
   * @Summary Delete a external
   * @Router DELETE /companies/{companyId}/externals/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Response 200 external OK
   * @Response 404 external not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.external.destroy(companyId, id)
    }
  }
}

module.exports = ExternalController
