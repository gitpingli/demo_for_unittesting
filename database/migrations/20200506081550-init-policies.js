'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { STRING, INTEGER, BOOLEAN, DATE, JSONB } = Sequelize
    return queryInterface.createTable('policies', {
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
      policyId: {
        type: STRING(56),
        unique: true,
        allowNull: false
      },
      accessRights: {
        type: JSONB
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
    return queryInterface.dropTable('policies')
  }
}
