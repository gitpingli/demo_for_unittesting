'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn(
          'services',
          'name',
          { type: Sequelize.STRING(64) },
          { transaction: t },
          {
            schema: process.env.POSTGRES_SCHEMA || 'public'
          }
        ),
        queryInterface.changeColumn(
          'services',
          'provideBy',
          { type: Sequelize.STRING(64) },
          { transaction: t },
          {
            schema: process.env.POSTGRES_SCHEMA || 'public'
          }
        )
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    // reverte the changes
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn(
          'services',
          'name',
          { type: Sequelize.STRING(24) },
          { transaction: t },
          {
            schema: process.env.POSTGRES_SCHEMA || 'public'
          }
        ),
        queryInterface.changeColumn(
          'services',
          'provideBy',
          { type: Sequelize.STRING(24) },
          { transaction: t },
          {
            schema: process.env.POSTGRES_SCHEMA || 'public'
          }
        )
      ])
    })
  }
}
