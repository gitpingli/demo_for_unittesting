/* eslint valid-jsdoc: "off" */
'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1573002367617_5605';
  // add your middleware config here
  config.middleware = ['errorHandler', 'auth'];

  config.auth = {
    authUrls: [
      '/users',
      '/quotes',
      '/workflows',
      '/orders',
      '/mef',
      '/productinstances',
      '/companies',
    ],
    ignores: ['/users/login', '/mef/productOfferingManagement'],
  };
  config.service = {
    user: {
      enabled: true, // false means use the fake data
      url: 'https://external-user.dev.core.consoleconnect.com',
      timeout: 5000,
      tokenName: 'Authorization',
      tokenBearer: 'Bearer',
      tokenBearerEnabled: true,
    },
    dm: {
      enabled: true, // false means use the fake data
      url: 'https://dm.dev.core.consoleconnect.com',
      timeout: 5000,
    },
    cpq: {
      enabled: true, // false means use the fake data
      url: 'https://external-cpq.dev.core.consoleconnect.com',
      timeout: 5000,
    },
    oms: {
      enabled: true, // false means use the fake data
      url: 'https://external-oms.dev.core.consoleconnect.com',
      timeout: 5000,
    },
    workflow: {
      enabled: true, // false means use the fake data
      url: 'https://workflow.dev.core.consoleconnect.com/v1',
      timeout: 5000,
    },
    consoleconnect: {
      email: 'cc_test@consolelabs.net',
      enabled: true, // false means use the fake data
      url: 'https://api.demo.consoleconnect.com',
      timeout: 5000,
    },
  };

  config.gateway = {
    adminUrl: 'https://admin.cloud.tyk.io/api',
    token: '5d1a103579ad471466afa216b36c5e62',
    apiUrl: 'https://api.dev.core.consoleconnect.com',
    orgId: '5e6982999e2a350001075431',
  };

  config.influx = {
    url: 'https://us-central1-1.gcp.cloud2.influxdata.com',
    token: '2kh0JvLEgElJTmrhGLm6bDfJUDn0UGjmNq7YOy39bnvOq_Ty0AciwjojvStxutgfBywsdvwpJzWKKDuhvYsKRA==',
    org: '22488fa2b457f775',
    bucket: 'tyk-dev-env'
  }

  config.sequelize = {
    dialect: 'postgres',
    database: 'platform',
    host: 'localhost',
    port: 5433,
    username: 'postgresql',
    password: 'password',
    schema: process.env.POSTGRES_SCHEMA || 'public',
  };

  return {
    ...config,
  };
};
