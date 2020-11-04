'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE } = Sequelize
    return queryInterface.createTable('keys', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      hash: {
        type: STRING(24),
        unique: true,
        allowNull: false
      },
      value: {
        type: STRING(56),
        unique: true,
        allowNull: false
      },
      applicationId: {
        type: INTEGER,
        allowNull: false
      },
      createdAt: DATE,
      updatedAt: DATE
    },
    {
      schema: process.env.POSTGRES_SCHEMA || 'public'
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable('keys')
  }
}
