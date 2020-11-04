'use strict'

const fs = require('fs')

module.exports = {
  development: {
    username: 'postgresql',
    password: 'password',
    database: 'platform',
    host: '127.0.0.1',
    dialect: 'postgres',
    schema: process.env.POSTGRES_SCHEMA || 'public'
  },
  unittest: {
    username: 'postgresql',
    password: 'password',
    database: 'platform',
    host: 'postgres',
    dialect: 'postgres',
    schema: process.env.POSTGRES_SCHEMA || 'public'
  },
  production: {
    dialect: 'postgres',
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: 5433,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PWD,
    schema: process.env.POSTGRES_SCHEMA,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        key: process.env.POSTGRES_KEY ? fs.readFileSync(process.env.POSTGRES_KEY) : null,
        cert: process.env.POSTGRES_CERT ? fs.readFileSync(process.env.POSTGRES_CERT) : null,
        ca: process.env.POSTGRES_CA ? fs.readFileSync(process.env.POSTGRES_CA) : null
      }
    }
  }
}
