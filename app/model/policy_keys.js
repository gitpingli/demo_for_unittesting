'use strict'

module.exports = app => {
  const { INTEGER } = app.Sequelize

  const PolicyKeys = app.model.define(
    'policy_keys',
    {
      policy_id: {
        type: INTEGER,
        references: {
          model: app.model.policy,
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
  return PolicyKeys
}
