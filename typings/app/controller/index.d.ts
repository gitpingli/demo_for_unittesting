// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApis = require('../../../app/controller/apis');
import ExportBase = require('../../../app/controller/base');
import ExportContract = require('../../../app/controller/contract');
import ExportEndpoint = require('../../../app/controller/endpoint');
import ExportHeartbeat = require('../../../app/controller/heartbeat');
import ExportRole = require('../../../app/controller/role');
import ExportSinglespa = require('../../../app/controller/singlespa');
import ExportConsoleconnectConnection = require('../../../app/controller/consoleconnect/connection');
import ExportConsoleconnectPort = require('../../../app/controller/consoleconnect/port');
import ExportCpqOffering = require('../../../app/controller/cpq/offering');
import ExportCpqProduct = require('../../../app/controller/cpq/product');
import ExportCpqQuote = require('../../../app/controller/cpq/quote');
import ExportGatewayApplication = require('../../../app/controller/gateway/application');
import ExportGatewayDashboard = require('../../../app/controller/gateway/dashboard');
import ExportGatewayKey = require('../../../app/controller/gateway/key');
import ExportGatewayPolicy = require('../../../app/controller/gateway/policy');
import ExportGatewayService = require('../../../app/controller/gateway/service');
import ExportOmsOrder = require('../../../app/controller/oms/order');
import ExportOmsProduct = require('../../../app/controller/oms/product');
import ExportQlcRpc = require('../../../app/controller/qlc/rpc');
import ExportSonataProductInventory = require('../../../app/controller/sonata/productInventory');
import ExportSonataProductOffering = require('../../../app/controller/sonata/productOffering');
import ExportSonataProductOrder = require('../../../app/controller/sonata/productOrder');
import ExportSonataQuote = require('../../../app/controller/sonata/quote');
import ExportUmsAgent = require('../../../app/controller/ums/agent');
import ExportUmsAuth = require('../../../app/controller/ums/auth');
import ExportUmsCompany = require('../../../app/controller/ums/company');
import ExportUmsExternal = require('../../../app/controller/ums/external');
import ExportUmsMember = require('../../../app/controller/ums/member');
import ExportUmsUser = require('../../../app/controller/ums/user');
import ExportUmsWallet = require('../../../app/controller/ums/wallet');
import ExportWorkflowDefinition = require('../../../app/controller/workflow/definition');
import ExportWorkflowVersions = require('../../../app/controller/workflow/versions');
import ExportWorkflowWorker = require('../../../app/controller/workflow/worker');

declare module 'egg' {
  interface IController {
    apis: ExportApis;
    base: ExportBase;
    contract: ExportContract;
    endpoint: ExportEndpoint;
    heartbeat: ExportHeartbeat;
    role: ExportRole;
    singlespa: ExportSinglespa;
    consoleconnect: {
      connection: ExportConsoleconnectConnection;
      port: ExportConsoleconnectPort;
    }
    cpq: {
      offering: ExportCpqOffering;
      product: ExportCpqProduct;
      quote: ExportCpqQuote;
    }
    gateway: {
      application: ExportGatewayApplication;
      dashboard: ExportGatewayDashboard;
      key: ExportGatewayKey;
      policy: ExportGatewayPolicy;
      service: ExportGatewayService;
    }
    oms: {
      order: ExportOmsOrder;
      product: ExportOmsProduct;
    }
    qlc: {
      rpc: ExportQlcRpc;
    }
    sonata: {
      productInventory: ExportSonataProductInventory;
      productOffering: ExportSonataProductOffering;
      productOrder: ExportSonataProductOrder;
      quote: ExportSonataQuote;
    }
    ums: {
      agent: ExportUmsAgent;
      auth: ExportUmsAuth;
      company: ExportUmsCompany;
      external: ExportUmsExternal;
      member: ExportUmsMember;
      user: ExportUmsUser;
      wallet: ExportUmsWallet;
    }
    workflow: {
      definition: ExportWorkflowDefinition;
      versions: ExportWorkflowVersions;
      worker: ExportWorkflowWorker;
    }
  }
}
