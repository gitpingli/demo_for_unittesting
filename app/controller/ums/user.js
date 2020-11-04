'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller User Management
 */
class UserController extends Controller {
  /**
   * @Summary List all users
   * @Router GET /users
   * @Request query string email search by email
   * @Request query boolean deleted
   * @Request query string roles role list, separated by comma, such as ADMIN,CUSTOMER
   * @Request query string state filter out user.state in one of the state
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 userList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }
    const { email, deleted, roles } = ctx.query
    const { state } = ctx.queries
    const data = await ctx.service.ums.user.getUsers({ email, deleted, roles, state })
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
   * @Summary Get a user by Id
   * @Router GET /users/{id}
   * @Request path string *id
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.user.findOne(id)
    }
  }

  /**
   * @Summary Update a user
   * @Router PATCH /users/{id}
   * @Request path string *id
   * @Request body updateUserPayload *body
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.validate(ctx.rule.updateUserPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.ums.user.update(id, ctx.request.body)
    }
  }

  /**
   * @Summary Delete a user
   * @Router DELETE /users/{id}
   * @Request path string *id
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.user.destroy(id)
    }
  }
}

module.exports = UserController
