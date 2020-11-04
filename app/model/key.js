'use strict'

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize

  const Key = app.model.define(
    'key',
    {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      hash: STRING(24),
      value: STRING(56),
      deleted: BOOLEAN
    },
    {
      timestamps: true,
      tableName: 'keys',
      underscored: false,
      schema: process.env.POSTGRES_SCHEMA || 'public'
    }
  )

  Key.associate = function () {
    app.model.Key.belongsToMany(app.model.Service, { through: 'service_keys' })
    app.model.Key.belongsToMany(app.model.Policy, { through: 'policy_keys' })

    app.model.Key.belongsTo(app.model.Application, {
      as: 'application',
      foreignKey: 'applicationId'
    })
  }

  Key.findByIdWithApplication = async function (id, applicationId) {
    return await this.findOne({
      where: { id, applicationId }
    })
  }

  return Key
}
