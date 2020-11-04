'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, DATE } = Sequelize
    return queryInterface.createTable('applications', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(64),
        unique: true,
        allowNull: false
      },
      owner: {
        type: STRING(64),
        allowNull: true
      },
      createdAt: DATE,
      updatedAt: DATE
    },
    {
      schema: process.env.POSTGRES_SCHEMA || 'public'
    })
  },

  down: queryInterface => {
    // drop application
    return queryInterface.dropTable('applications')
  }
}
