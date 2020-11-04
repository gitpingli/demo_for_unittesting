'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller Application Management
 */
class ApplicationController extends Controller {
  /**
   * @Summary List all applications
   * @Router GET /gateway/applications
   * @request query integer page
   * @request query integer pageSize
   * @request query string name
   * @request query boolean deleted
   * @Response 200 createdApplication OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      name: ctx.query.name,
      deleted: ctx.query.deleted,
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    const data = await ctx.service.gateway.application.list(query)

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
   * @Summary Get an application by id
   * @Router GET /gateway/applications/{id}
   * @Request path string *id
   * @Response 200 applicationDetail OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const application = await ctx.service.gateway.application.findById(id)
    ctx.body = {
      data: application
    }
  }

  /**
   * @Summary Create an application
   * @Router POST /gateway/applications
   * @Request body createApplicationPayload *body
   * @Response 200 createdApplication OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    ctx.validate(ctx.rule.createApplicationPayload, ctx.request.body)

    const result = await ctx.service.gateway.application.create(
      ctx.request.body
    )
    ctx.body = {
      data: result
    }
  }

  /**
   * @Summary Update an application
   * @Router PATCH /gateway/applications/{id}
   * @Request path string *id
   * @Request body createApplicationPayload *body
   * @Response 200 createdApplication OK
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params
    const newValues = ctx.request.body

    ctx.validate(ctx.rule.createApplicationPayload, newValues)

    const updatedApp = await ctx.service.gateway.application.update(
      newValues,
      id
    )
    ctx.body = {
      data: updatedApp
    }
  }

  /**
   * @Summary Delete an application
   * @Router DELETE /gateway/applications/{id}
   * @Request path string *id
   * @Response 200 createdApplication OK
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    const deletedApp = await ctx.service.gateway.application.destroy(id)
    ctx.body = {
      data: deletedApp
    }
  }
}

module.exports = ApplicationController
