'use strict'

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize
  const Service = app.model.define(
    'service',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: STRING(64),
      meta: STRING(56),
      apiId: STRING(56),
      accessSlug: STRING(256),
      targetUrl: STRING(512),
      authMode: BOOLEAN,
      provideBy: STRING(64),
      active: BOOLEAN,
      deleted: BOOLEAN
    },
    {
      timestamps: true,
      tableName: 'services',
      underscored: false,
      schema: process.env.POSTGRES_SCHEMA || 'public'
    }
  )

  Service.associate = function () {
    app.model.Service.belongsToMany(app.model.Key, { through: 'service_keys' })
  }

  return Service
}
