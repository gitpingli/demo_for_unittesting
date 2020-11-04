'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')

/**
 * @Controller Key Management
 */
class KeyController extends Controller {
  /**
   * @Summary List all keys
   * @Router GET /gateway/keys
   * @request query integer page
   * @request query integer pageSize
   * @request query boolean deleted
   * @Response 200 createdNewKey OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const query = {
      deleted: ctx.query.deleted,
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    const data = await ctx.service.gateway.key.list(query)
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
   * @Summary Get a key details
   * @Router GET /gateway/keys/{id}
   * @Request path string *id
   * @Response 200 createdNewKey OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const key = await ctx.service.gateway.key.findById(id)
    ctx.body = {
      data: key
    }
  }

  /**
   * @Summary Create a key
   * @Router POST /gateway/keys
   * @Request body createNewKeyPayload *body
   * @Response 200 createdNewKey OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    ctx.validate(ctx.rule.createNewKeyPayload, ctx.request.body)

    const result = await ctx.service.gateway.key.create(ctx.request.body)
    ctx.body = {
      data: result
    }
  }

  /**
   * @Summary Update a key
   * @Router PATCH /gateway/keys/{id}
   * @Request path string *id
   * @Request body createNewKeyPayload *body
   * @Response 200 createdNewKey OK
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params
    const newValues = ctx.request.body

    ctx.validate(ctx.rule.createNewKeyPayload, newValues)

    const updatedKey = await ctx.service.gateway.key.update(newValues, id)
    ctx.body = {
      data: updatedKey
    }
  }

  /**
   * @Summary Delete a key
   * @Router DELETE /gateway/keys/{id}
   * @Request path string *id
   * @Response 200 createdNewKey OK
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    const deletedKey = await ctx.service.gateway.key.destroy(id)
    ctx.body = {
      data: deletedKey
    }
  }
}

module.exports = KeyController
