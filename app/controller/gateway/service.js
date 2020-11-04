'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller Service Management
 */
class ServiceController extends Controller {
  /**
   * @Summary List all services
   * @Router GET /gateway/services
   * @request query integer page
   * @request query integer pageSize
   * @request query string name
   * @request query boolean deleted
   * @request query boolean authMode
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      name: ctx.query.name,
      deleted: ctx.query.deleted,
      authMode: ctx.query.authMode,
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    const data = await ctx.service.gateway.service.list(query)
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
   * @Summary Get an service by id
   * @Router GET /gateway/services/{id}
   * @Request path string *id
   * @Response 200 serviceDetail OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const service = await ctx.service.gateway.service.findById(id)
    ctx.body = {
      data: service
    }
  }

  /**
   * @Summary Create an service
   * @Router POST /gateway/services
   * @Request body createServicePayload *body
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    ctx.validate(ctx.rule.createServicePayload, ctx.request.body)

    const result = await ctx.service.gateway.service.create(ctx.request.body)
    ctx.body = {
      data: result
    }
  }

  /**
   * @Summary Update an service
   * @Router PATCH /gateway/services/{id}
   * @Request path string *id
   * @Request body createServicePayload *body
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params
    const newValues = ctx.request.body

    ctx.validate(ctx.rule.createServicePayload, newValues)

    const updatedService = await ctx.service.gateway.service.update(
      newValues,
      id
    )
    ctx.body = {
      data: updatedService
    }
  }

  /**
   * @Summary Delete an service
   * @Router DELETE /gateway/services/{id}
   * @Request path string *id
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    const service = await ctx.service.gateway.service.destroy(id)
    ctx.body = {
      data: service
    }
  }
}

module.exports = ServiceController
