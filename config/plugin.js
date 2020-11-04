'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  swaggerdoc: {
    enable: true,
    package: '@console/egg-swagger-doc'
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },
  io: {
    enable: true,
    package: 'egg-socket.io'
  }
}
