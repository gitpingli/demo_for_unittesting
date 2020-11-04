'use strict'

const Controller = require('egg').Controller

/**
 * @Controller Contract
 */
class ContractController extends Controller {
  /**
   * @Summary Create a contract
   * @Router POST /contracts
   * @Request body createContractPayload *body
   * @Response 200 contract OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    const { body } = ctx.request
    ctx.logger.info('createContractRequest:%j', body)

    // TODO:FIXME integration with CPQ
    ctx.body = {
      data: {
        id: 'FAKED_CONTRACT_ID'
      }
    }
    ctx.status = 200
  }
}

module.exports = ContractController
