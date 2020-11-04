'use strict'

const BaseController = require('./base')

class PartnersController extends BaseController {
  async index () {
    const { ctx } = this
    try {
      const apis = await ctx.service.apis.findList()
      ctx.body = apis
    } catch (e) {
      console.log(e)
    }

    ctx.status = 200
  }

  async show () {
    const { ctx } = this
    const apis = await ctx.service.apis.findOne()
    ctx.body = {
      data: apis
    }
    ctx.status = 200
  }

  async create () {
    const { ctx } = this

    ctx.body = { data: 'success' }
    ctx.status = 200
  }

  async edit () {
    const { ctx } = this

    ctx.body = { data: 'success' }
    ctx.status = 200
  }

  async update () {
    const { ctx } = this

    ctx.body = { data: 'success' }
    ctx.status = 200
  }

  async destroy () {
    const { ctx } = this

    ctx.body = { data: 'success' }
    ctx.status = 200
  }
}

module.exports = PartnersController
