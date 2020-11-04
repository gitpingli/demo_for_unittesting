'use strict'

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      {
        tableName: 'keys',
        schema: process.env.POSTGRES_SCHEMA || 'public'
      },
      'policyId', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    )
  },

  down (queryInterface) {
    // reverte the changes
    return queryInterface.removeColumn(
      {
        tableName: 'keys',
        schema: process.env.POSTGRES_SCHEMA || 'public'
      },
      'policyId'
    )
  }
}
