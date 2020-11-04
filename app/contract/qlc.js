'use strict'

module.exports = {
  error: {
    error: { type: 'string', required: true }
  },
  package: {
    name: { type: 'string', required: true },
    version: { type: 'string', required: true }
  },
  createQlcRequest: {
    method: { type: 'string', required: true },
    params: { type: 'string', required: true }
  },
  createQlcResponse: {}
}
