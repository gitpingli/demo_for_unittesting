'use strict'

const { app } = require('egg-mock/bootstrap')
const factories = require('./factories')

before(async () => {
  await Promise.all([
    app.model.Application.destroy({ truncate: true, force: true }),
    app.model.Service.destroy({ truncate: true, force: true }),
    app.model.Key.destroy({ truncate: true, force: true }),
    app.model.Policy.destroy({ truncate: true, force: true }),
    app.model.Singlespa.destroy({ truncate: true, force: true })
  ])
  factories(app)
})
afterEach(async () => {
  // clear database after each test case
  // await Promise.all([
  //   app.model.Application.destroy({ truncate: true, force: true }),
  //   app.model.Service.destroy({ truncate: true, force: true }),
  // ]);
})
