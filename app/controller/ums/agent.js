'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Agent Management
 */
class AgentController extends Controller {
  /**
   * @Summary List all agents
   * @Router GET /agents
   * @Request query string email
   * @Request query boolean deleted
   * @Request query string roles
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

    ctx.logger.info('query:%j', ctx.query)
    const data = await ctx.service.ums.agent.getUsers(ctx.query)
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
   * @Summary Get a agent by Id
   * @Router GET /agents/{id}
   * @Request path string *id
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.agent.findOne(id)
    }
  }

  /**
   * @Summary Create a agent
   * @Router POST /agents
   * @Request body createUserPayload *body
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createUserPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.ums.agent.create(ctx.request.body)
    }
  }

  /**
   * @Summary Update a agent
   * @Router PATCH /agents/{id}
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
      data: await ctx.service.ums.agent.update(id, ctx.request.body)
    }
  }

  /**
   * @Summary Delete a agent
   * @Router DELETE /agents/{id}
   * @Request path string *id
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.agent.destroy(id)
    }
  }
}

module.exports = AgentController
