'use strict'

const { factory } = require('factory-girl')

module.exports = app => {
  app.factory = factory

  factory.define('application', app.model.Application, {
    name: factory.sequence('Application.name', n => `app_${n}`),
    owner: 'factory-girl'
  })
}
