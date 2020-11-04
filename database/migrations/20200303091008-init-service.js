'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, BOOLEAN, DATE } = Sequelize
    return queryInterface.createTable('services', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(24),
        unique: true,
        allowNull: false
      },
      meta: {
        type: STRING(56),
        unique: true,
        allowNull: false
      },
      apiId: {
        type: STRING(56),
        unique: true,
        allowNull: false
      },
      accessSlug: {
        type: STRING(256),
        unique: true,
        allowNull: false
      },
      targetUrl: {
        type: STRING(512),
        allowNull: false
      },
      authMode: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      provideBy: {
        type: STRING(24),
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
    return queryInterface.dropTable('services')
  }
}
