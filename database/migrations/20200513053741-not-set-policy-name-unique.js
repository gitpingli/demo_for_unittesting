'use strict'

module.exports = {
  up: async queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.sequelize.query(
        'ALTER TABLE policies DROP CONSTRAINT IF EXISTS policies_name_key;',
        { transaction: t },
        {
          schema: process.env.POSTGRES_SCHEMA || 'public'
        }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    // reverte the changes
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.changeColumn(
        'policies',
        'name',
        { type: Sequelize.STRING(64), unique: true, allowNull: false },
        { transaction: t },
        {
          schema: process.env.POSTGRES_SCHEMA || 'public'
        }
      )
    })
  }
}
