'use strict'

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN, JSONB } = app.Sequelize
  const Policy = app.model.define(
    'policy',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: STRING(64),
      policyId: STRING(56),
      accessRights: JSONB,
      active: BOOLEAN,
      deleted: BOOLEAN
    },
    {
      timestamps: true,
      tableName: 'policies',
      underscored: false,
      schema: process.env.POSTGRES_SCHEMA || 'public'
    }
  )

  Policy.associate = function () {
    app.model.Policy.belongsToMany(app.model.Key, { through: 'policy_keys' })
  }

  return Policy
}
