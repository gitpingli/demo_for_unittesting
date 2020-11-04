'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, BOOLEAN, DATE } = Sequelize
    return queryInterface.createTable('singlespas', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(128),
        unique: true,
        allowNull: false
      },
      url: {
        type: STRING(128),
        unique: false,
        allowNull: false
      },
      active: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      deleted: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: DATE,
      updatedAt: DATE
    },
    {
      schema: process.env.POSTGRES_SCHEMA || 'public'
    })
  },

  down: queryInterface => {
    return queryInterface.dropTable('singlespas')
  }
}
