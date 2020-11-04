'use strict'

const Controller = require('egg').Controller

/**
 * @Controller Auth
 */
class AuthController extends Controller {
  /**
   * @Summary Login
   * @Router POST /login
   * @Request body loginUserPayload *body
   * @Response 200 authToken OK
   * @Response 500 error Unknown internal server error
   */
  async login () {
    const { ctx } = this
    const { username, password } = ctx.request.body

    ctx.body = {
      data: await ctx.service.ums.agent.login(username, password)
    }
  }

  /**
   * @Summary logout
   * @Router POST /logout
   * @Response 200 user OK
   * @Response 500 error Unknown internal server error
   */
  async logout () {
    const { ctx } = this
    ctx.logger.info('logout done')
  }

  /**
   * @Summary Get current loggedInUser
   * @Router GET /loggedInUser
   * @Response 200 user OK
   * @Response 500 error Unknown internal server error
   */
  async loggedInUser () {
    const { ctx } = this
    ctx.body = {
      data: await ctx.service.ums.agent.getLoggedInUser()
    }
  }
}

module.exports = AuthController
