'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize
    return queryInterface.createTable('service_keys', {
      service_id: {
        type: INTEGER
      },
      key_id: {
        type: INTEGER
      },
      created_at: DATE,
      updated_at: DATE
    },
    {
      schema: process.env.POSTGRES_SCHEMA || 'public'
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable('service_keys')
  }
}
