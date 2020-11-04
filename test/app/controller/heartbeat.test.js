'use strict'

const { app, assert } = require('egg-mock/bootstrap')
const _ = require('lodash')

describe('test/app/controller/heartbeat.test.js', () => {
  it('should GET /heartbeat', async () => {
    const res = await app
      .httpRequest()
      .get('/heartbeat')
      .expect(200)
    _.each(
      [
        'name',
        'version',
        'description',
        'status',
        'releasedAt',
        'current',
        'startUpAt'
      ],
      key => assert(res.body[key])
    )
  })
})
