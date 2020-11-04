'use strict'

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize

  const Application = app.model.define(
    'application',
    {
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
      deleted: BOOLEAN
    },
    {
      timestamps: true,
      tableName: 'applications',
      underscored: false,
      schema: process.env.POSTGRES_SCHEMA || 'public'
    }
  )

  Application.associate = function () {
    app.model.Application.hasMany(app.model.Key, { as: 'keys' })
  }

  return Application
}
