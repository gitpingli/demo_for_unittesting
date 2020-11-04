'use strict'

const Service = require('egg').Service
const {
  getFakeList,
  getFakeOne
} = require('../../mockData/apisManagement')

class ApisService extends Service {
  async findList () {
    const apis = await getFakeList()
    return apis
  }

  async findOne () {
    const apis = await getFakeOne()
    return apis
  }
}

module.exports = ApisService
