'use strict'

const { Controller } = require('egg')

class BaseController extends Controller {
  constructor (ctx) {
    super(ctx)
    this._ = require('lodash')
  }

  array2Res (data) {
    return {
      status: 200,
      size: data.length,
      data
    }
  }
}

module.exports = BaseController
