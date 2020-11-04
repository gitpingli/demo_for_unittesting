'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Singlespa Management
 */
class SinglespaController extends Controller {
  /**
   * @Summary List all existing singlespa
   * @Router GET /singlespas
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
    const data = await ctx.service.singlespa.list(ctx.query)
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
   * @Summary List all Active singlespa
   * @Router GET /singlespa/findActive
   * @Response 200 offeringList OK
   * @Response 500 error Unknown internal server error
   */
  async findActive () {
    const { ctx } = this
    const query = {
      deleted: false,
      active: true
    }
    const data = await ctx.service.singlespa.list(query)
    const meta = {
      total: data.length
    }
    ctx.body = {
      data: data,
      meta
    }
  }

  /**
   * @Summary Get an singlespa by id
   * @Router GET /singlespas/{id}
   * @Request path string *id
   * @Response 200 serviceDetail OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const singlespa = await ctx.service.singlespa.findById(id)
    ctx.body = {
      data: singlespa
    }
  }

  /**
   * @Summary Create an Singlespa
   * @Router POST /singlespas
   * @Request body createServicePayload *body
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    ctx.validate(ctx.rule.createSinglespaPayload, ctx.request.body)

    const singlespa = await ctx.service.singlespa.create(ctx.request.body)
    ctx.body = {
      data: singlespa
    }
  }

  /**
   * @Summary Update an Singlespa
   * @Router PATCH /singlespas/{id}
   * @Request path string *id
   * @Request body createServicePayload *body
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params
    const newValues = ctx.request.body

    ctx.validate(ctx.rule.createSinglespaPayload, newValues)

    const updatedSinglespa = await ctx.service.singlespa.update(
      newValues,
      id
    )
    ctx.body = {
      data: updatedSinglespa
    }
  }

  /**
   * @Summary Delete an Singlespa
   * @Router DELETE /singlespas/{id}
   * @Request path string *id
   * @Response 200 createdService OK
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    const singlespa = await ctx.service.singlespa.destroy(id)
    ctx.body = {
      data: singlespa
    }
  }
}

module.exports = SinglespaController
