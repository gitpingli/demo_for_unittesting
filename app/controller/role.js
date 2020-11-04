'use strict'

const Controller = require('egg').Controller

/**
 * @Controller Role Management
 */
class RoleController extends Controller {
  /**
   * @Summary List all roles
   * @Router GET /roles
   * @Response 200 roleList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      // limit: toInt(ctx.query.limit),
      // offset: toInt(ctx.query.offset),
    }
    const data = await ctx.service.role.list(query)
    const meta = {
      total: data.length,
      page: 0,
      per_page: 100
    }
    ctx.body = {
      data,
      meta
    }
  }

  /**
   * @Summary Get a role by id
   * @Router GET /roles/{id}
   * @Request path string *id
   * @Response 200 role OK
   * @Response 404 error role not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.role.findById(id)
    }
  }

  /**
   * @Summary Create a role
   * @Router POST /roles
   * @Request body createRolePayload *body
   * @Response 200 role OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    ctx.validate(ctx.rule.createRolePayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.role.create(ctx.request.body)
    }
  }

  /**
   * @Summary Update a role
   * @Router PATCH /roles/{id}
   * @Request path int *id
   * @Request body updateRolePayload *body
   * @Response 200 role OK
   * @Response 200 error Role not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params
    const payload = ctx.request.body

    ctx.validate(ctx.rule.updateRolePayload, payload)

    ctx.body = {
      data: await ctx.service.role.update(id, payload)
    }
  }
}

module.exports = RoleController
