'use strict'

module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        {
          tableName: 'applications',
          schema: process.env.POSTGRES_SCHEMA || 'public'
        },
        'deleted', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        {
          tableName: 'keys',
          schema: process.env.POSTGRES_SCHEMA || 'public'
        },
        'deleted',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      )
    ])
  },

  down (queryInterface) {
    // reverte the changes
    return Promise.all([
      queryInterface.removeColumn(
        {
          tableName: 'applications',
          schema: process.env.POSTGRES_SCHEMA || 'public'
        },
        'deleted'
      ),
      queryInterface.removeColumn(
        {
          tableName: 'keys',
          schema: process.env.POSTGRES_SCHEMA || 'public'
        },
        'deleted'
      )
    ])
  }
}
