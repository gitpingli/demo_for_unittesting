/* eslint valid-jsdoc: "off" */

'use strict'
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // ############################################################################
  // SECTION A
  // universal configs that for all the envs in this section
  // ############################################################################

  config.auth = {
    authUrls: [
      '/users',
      '/gateway',
      '/quotes',
      '/workflows',
      '/orders',
      '/mef',
      '/productinstances',
      '/companies',
      '/rpc'
    ],
    ignores: ['/users/login', '/mef/productOfferingManagement']
  }
  // set request timeout
  config.httpclient = {
    enableDNSCache: false,
    dnsCacheLookupInterval: 10000,
    dnsCacheMaxLength: 1000,

    request: {
      timeout: 15000
    }
  }

  config.bodyParser = {
    enableTypes: ['json', 'form', 'text', 'xml']
  }

  exports.multipart = {
    mode: 'file',
    fileExtensions: ['.bpmn']
  }

  // allow cors
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  }

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  config.jwt = {
    secret: '[TODO]'
  }

  config.static = {
    prefix: ''
  }

  config.logger = {
    // json format
    outputJSON: true,
    // no log into files
    level: 'NONE',
    // INFO WARN and ERROR into console
    consoleLevel: 'INFO',
    // enbale console log in prod after ready (not recommanded by egg.js)
    disableConsoleAfterReady: false
  }

  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: []
      }
    }
  }

  // ############################################################################
  // SECTION A
  // universal configs ends
  // ############################################################################

  // ############################################################################
  // SECTION B
  // configs that vary depending on the envs
  // please inform team members if you changed the section below
  // ############################################################################

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573002367617_5605'

  // add your middleware config here
  config.middleware = ['errorHandler', 'auth']

  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'Sherpa API',
      description: 'Sherpa APIs document',
      version: '1.0.0'
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    enable: true,
    routerMap: false,
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    }
  }

  config.service = {
    user: {
      enabled: true, // false means use the fake data
      url: 'https://external-user.dev.core.consoleconnect.com',
      timeout: 5000,
      tokenName: 'Authorization',
      tokenBearer: 'Bearer',
      tokenBearerEnabled: true
    },
    dm: {
      enabled: false, // false means use the fake data
      url: 'https://dm.dev.core.consoleconnect.com',
      timeout: 5000
    },
    cpq: {
      enabled: false, // false means use the fake data
      url: 'https://external-cpq.dev.core.consoleconnect.com',
      timeout: 5000
    },
    oms: {
      enabled: true, // false means use the fake data
      url: 'https://external-oms.dev.core.consoleconnect.com',
      timeout: 5000
    },
    workflow: {
      enabled: true, // false means use the fake data
      url: 'https://workflow.dev.core.consoleconnect.com',
      timeout: 10000
    },
    consoleconnect: {
      email: 'cc_test@consolelabs.net'
    }
  }

  config.gateway = {
    adminUrl: 'https://admin.cloud.tyk.io/api',
    token: process.TYK_API_ACCESS_TOKEN,
    apiUrl: 'https://api.dev.core.consoleconnect.com',
    orgId: process.env.TYK_API_ORG_ID
  }

  config.influx = {
    url: 'https://us-central1-1.gcp.cloud2.influxdata.com',
    token: process.env.INFLUX_TOKEN,
    org: process.env.INFLUX_ORG_ID,
    bucket: 'tyk-dev-env'
  }

  config.sequelize = {
    dialect: 'postgres',
    database: 'platform',
    host: 'postgres',
    port: 5433,
    username: 'postgresql',
    password: 'password',
    schema: process.env.POSTGRES_SCHEMA || 'public'
  }

  config.qlc = {
    rpcUrl: 'https://pccwg-node.dev.core.consoleconnect.com',
    timeout: 5000
  }

  return {
    ...config
  }
}
