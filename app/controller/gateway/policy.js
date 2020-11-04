'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller Policy Management
 */
class PolicyController extends Controller {
  /**
   * @Summary List all policies
   * @Router GET /gateway/policies
   * @request query integer page
   * @request query integer pageSize
   * @request query string name
   * @request query boolean deleted
   * @Response 200 policyDetail OK
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

    const data = await ctx.service.gateway.policy.list(query)
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
   * @Summary Get a policy by id
   * @Router GET /gateway/policies/{id}
   * @Request path string *id
   * @Response 200 policyDetail OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const policy = await ctx.service.gateway.policy.findById(id)
    ctx.body = {
      data: policy
    }
  }

  /**
   * @Summary Create a policy
   * @Router POST /gateway/policies
   * @Request body createPolicyPayload *body
   * @Response 200 createdPolicy OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    ctx.validate(ctx.rule.createPolicyPayload, ctx.request.body)

    const result = await ctx.service.gateway.policy.create(ctx.request.body)
    ctx.body = {
      data: result
    }
  }

  /**
   * @Summary Update a policy
   * @Router PATCH /gateway/policies/{id}
   * @Request path string *id
   * @Request body createPolicyPayload *body
   * @Response 200 createdPolicy OK
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params
    const newValues = ctx.request.body

    ctx.validate(ctx.rule.createPolicyPayload, newValues)

    const updatedPolicy = await ctx.service.gateway.policy.update(
      newValues,
      id
    )
    ctx.body = {
      data: updatedPolicy
    }
  }

  /**
   * @Summary Delete a policy
   * @Router DELETE /gateway/policies/{id}
   * @Request path string *id
   * @Response 200 createdPolicy OK
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    const deletedPolicy = await ctx.service.gateway.policy.destroy(id)
    ctx.body = {
      data: deletedPolicy
    }
  }
}

module.exports = PolicyController
