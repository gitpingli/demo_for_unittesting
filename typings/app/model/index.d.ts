// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApplication = require('../../../app/model/application');
import ExportKey = require('../../../app/model/key');
import ExportPolicy = require('../../../app/model/policy');
import ExportPolicyKeys = require('../../../app/model/policy_keys');
import ExportService = require('../../../app/model/service');
import ExportServiceKeys = require('../../../app/model/service_keys');
import ExportSinglespa = require('../../../app/model/singlespa');

declare module 'egg' {
  interface IModel {
    Application: ReturnType<typeof ExportApplication>;
    Key: ReturnType<typeof ExportKey>;
    Policy: ReturnType<typeof ExportPolicy>;
    PolicyKeys: ReturnType<typeof ExportPolicyKeys>;
    Service: ReturnType<typeof ExportService>;
    ServiceKeys: ReturnType<typeof ExportServiceKeys>;
    Singlespa: ReturnType<typeof ExportSinglespa>;
  }
}
