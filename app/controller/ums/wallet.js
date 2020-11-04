'use strict'

const Controller = require('egg').Controller

/**
 * @Controller Wallet Management
 */
class WalletController extends Controller {
  /**
   * @Summary List a company's wallets
   * @Router GET /companies/{companyId}/wallets
   * @Request path string *companyId
   * @Response 200 company OK
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const { companyId } = ctx.params

    const data = await ctx.service.ums.wallet.list(companyId)
    const meta = {
      total: data.length,
      page: 1,
      per_page: 100
    }
    ctx.body = {
      data,
      meta
    }
  }

  /**
   * @Summary Get a wallet by Id
   * @Router GET /companies/{companyId}/wallets/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Response 200 walletList OK
   * @Response 404 wallet not found
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.wallet.findOne(companyId, id)
    }
  }

  /**
   * @Summary Add a wallet into company
   * @Router POST /companies/{companyId}/wallets
   * @Request path string *companyId
   * @Request body createWalletPayload *body
   * @Response 200 wallet OK
   * @Response 404 wallet not found
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this
    const { companyId } = ctx.params

    ctx.validate(ctx.rule.createWalletPayload, ctx.request.body)

    ctx.body = {
      data: await ctx.service.ums.wallet.create(companyId, ctx.request.body)
    }
  }

  /**
   * @Summary Update a wallet
   * @Router PATCH /companies/{companyId}/wallets/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Request body updateWalletPayload *body
   * @Response 200 wallet OK
   * @Response 404 wallet not found
   * @Response 500 error Unknown internal server error
   */
  async update () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.validate(ctx.rule.updateWalletPayload, ctx.request.body)
    ctx.body = {
      data: await ctx.service.ums.wallet.update(
        companyId,
        id,
        ctx.request.body
      )
    }
  }

  /**
   * @Summary Delete a wallet
   * @Router DELETE /companies/{companyId}/wallets/{id}
   * @Request path string *companyId
   * @Request path string *id
   * @Response 200 wallet OK
   * @Response 404 wallet not found
   * @Response 500 error Unknown internal server error
   */
  async destroy () {
    const { ctx } = this
    const { companyId, id } = ctx.params

    ctx.body = {
      data: await ctx.service.ums.wallet.destroy(companyId, id)
    }
  }
}

module.exports = WalletController
