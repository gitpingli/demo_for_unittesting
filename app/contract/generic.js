'use strict'

module.exports = {
  error: {
    error: { type: 'string', required: true }
  },
  package: {
    name: { type: 'string', required: true },
    version: { type: 'string', required: true }
  },
  heartbeat: {
    version: { type: 'string', required: true },
    name: { type: 'string', required: true },
    description: { type: 'string', required: true },
    status: { type: 'string', required: true }
  }
}
