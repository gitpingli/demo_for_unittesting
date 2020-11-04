'use strict'

module.exports = {
  workerModel: {
    uri: { type: 'string', required: true },
    httpMethod: { type: 'string', required: true },
    uriVariables: { type: 'string', required: false },
    headers: { type: 'string', required: false },
    requestBody: { type: 'object', required: false },
    inputSchema: { type: 'object', required: false },
    outputSchema: { type: 'object', required: false }
  }
}
