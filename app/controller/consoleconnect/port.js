'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller CC_Port Management
 */
class PortController extends Controller {
  /**
   * @Summary List a company's all existing ports
   * @Router GET /companies/{companyId}/consoleconnect/ports
   * @Request path string *companyId consolecore company id
   * @Request query string pageSize
   * @Request query string page
   * @Response 200 portList OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }

    const { companyId } = ctx.params
    const data = await ctx.service.consoleconnect.port.search(
      companyId,
      ctx.query
    )
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
   * @Summary Get a port by Id
   * @Router GET /companies/{companyId}/consoleconnect/ports/{id}
   * @Request path string *companyId consolecore company id
   * @Request path string *id consoleconnect port id
   * @Response 200 port OK
   * @Response 404 port not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.consoleconnect.port.findOne(companyId, id)
    }
  }

  /**
   * @Summary Get a port's utilization
   * @Router GET /companies/{companyId}/consoleconnect/ports/{id}/utilization
   * @Request path string *companyId consolecore company id
   * @Request path string *id consoleconnect port id
   * @Request query string startTime Unix timestamp for beginning of time window
   * @Request query string Unix timestamp for end of time window
   * @Request query Set the resolution of response (day | hour | minute). Defaults to minute if not passed. Note: as minute is the smallest resolution, it will not have min/max fields in the response
   * @Response 200 utilization OK
   * @Response 404 port not found
   * @Response 500 error Unknown internal server error
   */
  async utilization () {
    const { ctx } = this
    const { companyId, id } = ctx.params
    const { startTime, endTime, resolution } = ctx.query
    ctx.body = {
      data: await ctx.service.consoleconnect.port.getUtilization(
        companyId,
        id,
        startTime,
        endTime,
        resolution
      )
    }
  }
}

module.exports = PortController
