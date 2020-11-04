'use strict'

module.exports = app => {
  const { INTEGER } = app.Sequelize

  const ServiceKeys = app.model.define(
    'service_keys',
    {
      service_id: {
        type: INTEGER,
        references: {
          model: app.model.service,
          key: 'id'
        }
      },
      key_id: {
        type: INTEGER,
        references: {
          model: app.model.key,
          key: 'id'
        }
      }
    },
    {
      schema: process.env.POSTGRES_SCHEMA || 'public'
    }
  )
  return ServiceKeys
}
