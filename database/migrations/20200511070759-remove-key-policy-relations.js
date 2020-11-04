'use strict'

module.exports = {
  up (queryInterface) {
    return queryInterface.removeColumn(
      {
        tableName: 'keys',
        schema: process.env.POSTGRES_SCHEMA || 'public'
      },
      'policyId'
    )
  },
  down (queryInterface, Sequelize) {
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
  }
}
