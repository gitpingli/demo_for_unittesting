// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportApis = require('../../../app/service/apis');
import ExportBackend = require('../../../app/service/backend');
import ExportHeartbeat = require('../../../app/service/heartbeat');
import ExportRole = require('../../../app/service/role');
import ExportSinglespa = require('../../../app/service/singlespa');
import ExportUtil = require('../../../app/service/util');
import ExportConsoleconnectCc = require('../../../app/service/consoleconnect/cc');
import ExportConsoleconnectConnection = require('../../../app/service/consoleconnect/connection');
import ExportConsoleconnectPort = require('../../../app/service/consoleconnect/port');
import ExportCpqOffering = require('../../../app/service/cpq/offering');
import ExportCpqProduct = require('../../../app/service/cpq/product');
import ExportCpqQuote = require('../../../app/service/cpq/quote');
import ExportGatewayApplication = require('../../../app/service/gateway/application');
import ExportGatewayDashboard = require('../../../app/service/gateway/dashboard');
import ExportGatewayKey = require('../../../app/service/gateway/key');
import ExportGatewayPolicy = require('../../../app/service/gateway/policy');
import ExportGatewayService = require('../../../app/service/gateway/service');
import ExportGatewayTyk = require('../../../app/service/gateway/tyk');
import ExportIbmVirtualServer = require('../../../app/service/ibm/virtualServer');
import ExportOmsOrder = require('../../../app/service/oms/order');
import ExportOmsProduct = require('../../../app/service/oms/product');
import ExportQlcDODSettlement = require('../../../app/service/qlc/DODSettlement');
import ExportQlcAccount = require('../../../app/service/qlc/account');
import ExportQlcLedger = require('../../../app/service/qlc/ledger');
import ExportQlcNet = require('../../../app/service/qlc/net');
import ExportQlcPermission = require('../../../app/service/qlc/permission');
import ExportQlcPov = require('../../../app/service/qlc/pov');
import ExportQlcPtmkey = require('../../../app/service/qlc/ptmkey');
import ExportQlcRpc = require('../../../app/service/qlc/rpc');
import ExportQlcSettlement = require('../../../app/service/qlc/settlement');
import ExportSonataProductInventory = require('../../../app/service/sonata/productInventory');
import ExportSonataProductOffering = require('../../../app/service/sonata/productOffering');
import ExportSonataProductOrder = require('../../../app/service/sonata/productOrder');
import ExportSonataQuote = require('../../../app/service/sonata/quote');
import ExportSonataSonataBackEnd = require('../../../app/service/sonata/sonataBackEnd');
import ExportUmsAgent = require('../../../app/service/ums/agent');
import ExportUmsCompany = require('../../../app/service/ums/company');
import ExportUmsExternal = require('../../../app/service/ums/external');
import ExportUmsMember = require('../../../app/service/ums/member');
import ExportUmsUms = require('../../../app/service/ums/ums');
import ExportUmsUser = require('../../../app/service/ums/user');
import ExportUmsWallet = require('../../../app/service/ums/wallet');

declare module 'egg' {
  interface IService {
    apis: AutoInstanceType<typeof ExportApis>;
    backend: AutoInstanceType<typeof ExportBackend>;
    heartbeat: AutoInstanceType<typeof ExportHeartbeat>;
    role: AutoInstanceType<typeof ExportRole>;
    singlespa: AutoInstanceType<typeof ExportSinglespa>;
    util: AutoInstanceType<typeof ExportUtil>;
    consoleconnect: {
      cc: AutoInstanceType<typeof ExportConsoleconnectCc>;
      connection: AutoInstanceType<typeof ExportConsoleconnectConnection>;
      port: AutoInstanceType<typeof ExportConsoleconnectPort>;
    }
    cpq: {
      offering: AutoInstanceType<typeof ExportCpqOffering>;
      product: AutoInstanceType<typeof ExportCpqProduct>;
      quote: AutoInstanceType<typeof ExportCpqQuote>;
    }
    gateway: {
      application: AutoInstanceType<typeof ExportGatewayApplication>;
      dashboard: AutoInstanceType<typeof ExportGatewayDashboard>;
      key: AutoInstanceType<typeof ExportGatewayKey>;
      policy: AutoInstanceType<typeof ExportGatewayPolicy>;
      service: AutoInstanceType<typeof ExportGatewayService>;
      tyk: AutoInstanceType<typeof ExportGatewayTyk>;
    }
    ibm: {
      virtualServer: AutoInstanceType<typeof ExportIbmVirtualServer>;
    }
    oms: {
      order: AutoInstanceType<typeof ExportOmsOrder>;
      product: AutoInstanceType<typeof ExportOmsProduct>;
    }
    qlc: {
      dODSettlement: AutoInstanceType<typeof ExportQlcDODSettlement>;
      account: AutoInstanceType<typeof ExportQlcAccount>;
      ledger: AutoInstanceType<typeof ExportQlcLedger>;
      net: AutoInstanceType<typeof ExportQlcNet>;
      permission: AutoInstanceType<typeof ExportQlcPermission>;
      pov: AutoInstanceType<typeof ExportQlcPov>;
      ptmkey: AutoInstanceType<typeof ExportQlcPtmkey>;
      rpc: AutoInstanceType<typeof ExportQlcRpc>;
      settlement: AutoInstanceType<typeof ExportQlcSettlement>;
    }
    sonata: {
      productInventory: AutoInstanceType<typeof ExportSonataProductInventory>;
      productOffering: AutoInstanceType<typeof ExportSonataProductOffering>;
      productOrder: AutoInstanceType<typeof ExportSonataProductOrder>;
      quote: AutoInstanceType<typeof ExportSonataQuote>;
      sonataBackEnd: AutoInstanceType<typeof ExportSonataSonataBackEnd>;
    }
    ums: {
      agent: AutoInstanceType<typeof ExportUmsAgent>;
      company: AutoInstanceType<typeof ExportUmsCompany>;
      external: AutoInstanceType<typeof ExportUmsExternal>;
      member: AutoInstanceType<typeof ExportUmsMember>;
      ums: AutoInstanceType<typeof ExportUmsUms>;
      user: AutoInstanceType<typeof ExportUmsUser>;
      wallet: AutoInstanceType<typeof ExportUmsWallet>;
    }
  }
}
