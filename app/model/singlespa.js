'use strict'

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize

  const Singlespa = app.model.define(
    'singlespa',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: STRING(128),
      url: STRING(128),
      active: BOOLEAN,
      deleted: BOOLEAN
    },
    {
      timestamps: true,
      tableName: 'singlespas',
      underscored: false,
      schema: process.env.POSTGRES_SCHEMA || 'public'
    }
  )

  return Singlespa
}
