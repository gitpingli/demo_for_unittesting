'use strict'

module.exports = {
  createdService: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    targetUrl: { type: 'string', required: true },
    accessSlug: { type: 'string', required: true },
    meta: { type: 'string', required: false },
    apiId: { type: 'string', required: false },
    authMode: { type: 'boolean', default: true, required: false },
    provideBy: { type: 'string', required: false },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true }
  },

  serviceDetail: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    targetUrl: { type: 'string', required: true },
    accessSlug: { type: 'string', required: true },
    meta: { type: 'string', required: false },
    apiId: { type: 'string', required: false },
    authMode: { type: 'boolean', default: true, required: false },
    provideBy: { type: 'string', required: false },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
    keys: { type: 'array', required: true, itemType: 'keyInService' },
    accessUrl: { type: 'string', required: true },
    policies: { type: 'array', required: true, itemType: 'createdPolicy' }
  },

  keyInService: {
    hash: { type: 'string', required: true },
    value: { type: 'string', required: true },
    deleted: { type: 'boolean', default: false, required: false },
    application: { type: 'createdApplication', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
    policies: { type: 'array', required: true, itemType: 'createdPolicy' }
  },

  createServicePayload: {
    name: { type: 'string', required: true },
    targetUrl: { type: 'string', required: true },
    accessSlug: { type: 'string', required: true },
    authMode: { type: 'boolean', default: true, required: false },
    provideBy: { type: 'string', required: true },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false }
  },

  createdNewKey: {
    hash: { type: 'string', required: true },
    value: { type: 'string', required: true },
    deleted: { type: 'boolean', default: false, required: false },
    applicationId: { type: 'string', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
    services: { type: 'array', required: true, itemType: 'createdService' },
    policies: { type: 'array', required: true, itemType: 'createdPolicy' }
  },

  createNewKeyPayload: {
    applicationId: { type: 'string', required: true },
    serviceIds: { type: 'array', required: true, itemType: 'string' },
    policyIds: { type: 'array', required: false, itemType: 'string' }
  },

  createdApplication: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    owner: { type: 'string', required: true },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true }
  },

  applicationDetail: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    owner: { type: 'string', required: true },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
    keys: { type: 'array', required: true, itemType: 'createdNewKey' }
  },

  createApplicationPayload: {
    name: { type: 'string', required: true },
    owner: { type: 'string', required: false }
  },

  allowedUrl: {
    // FIXME: the error problem
    methods: {
      type: 'array',
      required: false,
      itemType: 'string'
    },
    url: { type: 'string', required: false }
  },

  accessRights: {
    serviceId: { type: 'string', required: true },
    allowedUrls: { type: 'array', required: false, itemType: 'allowedUrl' }
  },

  createPolicyPayload: {
    name: { type: 'string', required: true },
    // whitelist: { type: 'boolean', default: true, required: false },
    accessRights: { type: 'array', required: true, itemType: 'accessRights' },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false }
  },

  policyDetail: {
    name: { type: 'string', required: true },
    // whitelist: { type: 'boolean', default: true, required: false },
    accessRights: {
      type: 'array',
      required: true,
      itemType: 'accessRightsDetail'
    },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
    keys: { type: 'array', required: false, itemType: 'keyInPolicy' }
  },

  accessRightsDetail: {
    service: { type: 'createdService', required: true },
    allowedUrls: { type: 'array', required: false, itemType: 'allowedUrl' }
  },

  createdPolicy: {
    name: { type: 'string', required: true },
    // whitelist: { type: 'boolean', default: true, required: false },
    accessRights: { type: 'array', required: true, itemType: 'accessRights' },
    active: { type: 'boolean', default: true, required: false },
    deleted: { type: 'boolean', default: false, required: false },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true }
  },

  keyInPolicy: {
    hash: { type: 'string', required: true },
    value: { type: 'string', required: true },
    deleted: { type: 'boolean', default: false, required: false },
    application: { type: 'createdApplication', required: true },
    createdAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true }
  }
}
