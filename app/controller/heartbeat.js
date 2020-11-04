'use strict'

const BaseController = require('./base')

/**
 * @Controller HearBeat
 */
class HeartbeatController extends BaseController {
  /**
   * @Summary Get heartbeat info
   * @Router GET /heartbeat
   * @Response 200 heartbeat OK
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this

    ctx.body = await ctx.service.heartbeat.getInfo()
    ctx.status = 200
  }

  /**
   * @Summary Get a service's heartbeat info
   * @Router GET /heartbeat/{service}
   * @Request path string *service
   * @Response 200 heartbeat OK
   * @Response 500 error Unknown internal server error
   */
  async getByService () {
    const { ctx } = this
    const { service } = ctx.params

    ctx.body = await ctx.service.heartbeat.get(service)
    ctx.status = 200
  }
}

module.exports = HeartbeatController
