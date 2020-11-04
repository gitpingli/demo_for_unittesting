'use strict'

const Controller = require('egg').Controller

/**
 * @Controller Dashboard GW dashboard
 */
class DashboardController extends Controller {
  /**
   * @Summary Get API gateway usage of services
   * @Router GET /gateway/dashboard/services
   * @request query string id "serviceId"
   * @request query string shortcuts "D"/"W"/"M"/"Y"/"ALL" default: W
   * @request query string from "YYYY-MM-DD" overrides shortcuts
   * @request query string to "YYYY-MM-DD" overrides shortcuts
   * @request query string interval "^\d+(y|mo|w|d|h|m|s|ms)" default: 1h
   * @Response 200
   * @Response 500 error Unknown internal server error
   */
  async usageOfServices () {
    const { ctx } = this
    const res = await ctx.service.gateway.dashboard.usageOfServices(ctx.query)
    ctx.body = res
  }

  /**
   * @Summary Get API gateway keys' usage of an application
   * @Router GET /gateway/dashboard/applications/{id}
   * @Request path string *id
   * @request query string shortcuts "D"/"W"/"M"/"Y" default: W
   * @request query string from "YYYY-MM-DD" overrides shortcuts
   * @request query string to "YYYY-MM-DD" overrides shortcuts
   * @Response 200
   * @Response 500 error Unknown internal server error
   */
  async usageOfOneApplication () {
    const { ctx } = this
    const { id } = ctx.params

    const res = await ctx.service.gateway.dashboard.usageOfOneApplication(
      id,
      ctx.query
    )
    ctx.body = res
  }

  /**
   * @Summary Get API gateway usage tops
   * @Router GET /gateway/dashboard/tops
   * @request query string shortcuts "D"/"W"/"M"/"Y" default: W
   * @request query string from "YYYY-MM-DD" overrides shortcuts
   * @request query string to "YYYY-MM-DD" overrides shortcuts
   * @Response 200
   * @Response 500 error Unknown internal server error
   */
  async usageOfTops () {
    const { ctx } = this

    const res = await ctx.service.gateway.dashboard.usageOfTops(ctx.query)
    ctx.body = res
  }

  /**
   * @Summary Get API gateway usage info breakdown
   * @Router GET /gateway/dashboard/breakdown
   * @request query string shortcuts "D"/"W"/"M"/"Y" default: W
   * @request query string from "YYYY-MM-DD" overrides shortcuts
   * @request query string to "YYYY-MM-DD" overrides shortcuts
   * @Response 200
   * @Response 500 error Unknown internal server error
   */
  async usageBreakdown () {
    const { ctx } = this

    const res = await ctx.service.gateway.dashboard.usageBreakdown(
      ctx.query
    )
    ctx.body = res
  }
}

module.exports = DashboardController
