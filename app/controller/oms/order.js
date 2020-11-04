'use strict'

const Controller = require('egg').Controller
// const _ = require('lodash');
/**
 * @Controller Order Management
 */
class OrderController extends Controller {
  /**
   * @Summary Create a order
   * @Router POST /orders
   * @Request body createOrderPayload *body
   * @Response 200 order OK
   * @Response 404 order not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.createOrderPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.oms.order.create(ctx.request.body)
    }
  }

  /**
   * @Summary List all existing orders
   * @Router GET /orders
   * @Request query string companyId search by companyId
   * @Request query string externalId
   * @Request query string offeringId
   * @Request query string productId
   * @Request query string productProvider
   * @Request query string state
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 orderList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this

    const size = ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 20)
    const page = ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)

    const {
      companyId,
      externalId,
      offeringId,
      productId,
      productProvider
    } = ctx.query
    const { state } = ctx.queries

    ctx.body = await ctx.service.oms.order.search({
      companyId,
      externalId,
      offeringId,
      productId,
      productProvider,
      state,
      page,
      size
    })
  }

  /**
   * @Summary Get a order by Id
   * @Router GET /orders/{id}
   * @Request path string *id
   * @Response 200 user OK
   * @Response 404 user not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.oms.order.findOne(id)
    }
  }

  /**
   * @Summary Update a order
   * @Router PATCH /orders/{id}
   * @Request path string *id
   * @Request body updateOrderPayload *body
   * @Response 200 order OK
   * @Response 404 order not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.validate(ctx.rule.updateOrderPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.oms.order.update(id, ctx.request.body)
    }
  }

  /**
   * @Summary Delete a order
   * @Router DELETE /orders/{id}
   * @Request path string *id
   * @Response 200 order OK
   * @Response 404 order not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { id } = ctx.params

    ctx.body = {
      data: await ctx.service.oms.order.destroy(id)
    }
  }

  /**
   * @Summary View a order's change log
   * @Router GET /orders/{id}/logs
   * @Request path string *id
   * @Request query string pageSize
   * @Request query string page
   * @Response 200  OK
   * @Response 404 order not found
   * @Response 500 error Unknown internal server error
   */
  async viewLogs () {
    const { ctx } = this
    const { id } = ctx.params
    const query = {
      size: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    ctx.body = {
      ...(await ctx.service.oms.order.viewLogs(id, query))
    }
  }

  /**
   * @Summary Search orders by a product instance id
   * @Router GET /orderHistory/productInstance/{productInstanceId}
   * @Request path string *productInstanceId
   * @Request query string pageSize
   * @Request query string page
   * @Response 200  OK
   * @Response 404 order not found
   * @Response 500 error Unknown internal server error
   */
  async fetchOrdersByProductInstance () {
    const { ctx } = this
    const { productInstanceId } = ctx.params
    const query = {
      size: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    ctx.body = {
      ...(await ctx.service.oms.order.fetchOrdersByProductInstance(
        productInstanceId,
        query
      ))
    }
  }
}

module.exports = OrderController
