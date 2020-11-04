'use strict'
const { assert, app } = require('egg-mock/bootstrap')

describe('test/app/controller/services.test.js service CRUD', () => {
  describe('/services', () => {
    let serviceId,
      serviceName
    it('should not create a service if slug has leading /', async () => {
      app.mockCsrf()
      const res = await app
        .httpRequest()
        .post('/gateway/services')
        .send({
          name: 'testservice1Sonly',
          targetUrl:
              'https://external-dm.dev.core.consoleconnect.com/heartbeat',
          accessSlug: '//test1',
          provideBy: 'unitest'
        })

      assert(res.status === 400)
    })

    it('should create a new service', async () => {
      app.mockCsrf()
      let res = await app
        .httpRequest()
        .post('/gateway/services')
        .send({
          name: 'testservice1Sonly',
          targetUrl:
            'https://external-dm.dev.core.consoleconnect.com/heartbeat',
          accessSlug: 'test1',
          provideBy: 'unitest'
        })

      assert(res.status === 200)
      assert(res.body.data.id)

      res = await app
        .httpRequest()
        .get(`/gateway/services/${res.body.data.id}`)
      assert(res.status === 200)
      assert(res.body.data.name === 'testservice1Sonly')
      assert(res.body.data.meta)
      assert(res.body.data.apiId)
      serviceId = res.body.data.id
      serviceName = res.body.data.name
    })

    it('should list services', async () => {
      const res = await app.httpRequest().get('/gateway/services?page=1&pageSize=10')
      assert(res.status === 200)
      assert(res.body.data.length > 0)
      assert(res.body.data[0].meta)
      assert(res.body.data[0].apiId)
    })

    it('should get service by id', async () => {
      const res = await app.httpRequest().get(`/gateway/services/${serviceId}`)
      assert(res.status === 200)
      assert(res.body.data.name === serviceName)
      assert(res.body.data.meta)
      assert(res.body.data.apiId)
      assert(res.body.data.accessUrl)
      assert(res.body.data.keys)
      assert(res.body.data.policies)
    })

    it('should update a existing service', async () => {
      const res = await app
        .httpRequest()
        .patch(`/gateway/services/${serviceId}`)
        .send({
          name: 'updatedtestserviceSonly',
          accessSlug: 'test1',
          targetUrl: 'https://external-dm.dev.core.consoleconnect.com/heartbeat',
          authMode: false,
          active: false,
          provideBy: 'unitest'
        })
      assert(res.status === 200)
      assert(res.body.data.name === 'updatedtestserviceSonly')
      assert(res.body.data.accessSlug === 'test1')
      assert(res.body.data.targetUrl === 'https://external-dm.dev.core.consoleconnect.com/heartbeat')
      assert(res.body.data.authMode === false)
      assert(res.body.data.active === false)
      assert(res.body.data.provideBy === 'unitest')
      assert(res.body.data.meta)
      assert(res.body.data.apiId)
    })

    it('should delete a undeleted service', async () => {
      const res = await app
        .httpRequest()
        .delete(`/gateway/services/${serviceId}`)

      assert(res.status === 200)
      assert(res.body.data.name === 'updatedtestserviceSonly')
      assert(res.body.data.accessSlug === 'test1')
      assert(res.body.data.targetUrl === 'https://external-dm.dev.core.consoleconnect.com/heartbeat')
      assert(res.body.data.authMode === false)
      assert(res.body.data.active === false)
      assert(res.body.data.deleted === true)
      assert(res.body.data.provideBy === 'unitest')
      assert(res.body.data.meta)
      assert(res.body.data.apiId)
    })

    it('should list services by fuzzy name', async () => {
      const res = await app.httpRequest().get('/gateway/services?page=1&pageSize=10&name=Sonly')
      assert(res.status === 200)
      assert(res.body.data.length === 1)
      assert(res.body.data[0].name === 'updatedtestserviceSonly')
    })

    it('should list services by fuzzy name', async () => {
      const res = await app.httpRequest().get('/gateway/services?page=1&pageSize=10&authMode=false')
      assert(res.status === 200)
      assert(res.body.data.length === 1)
      assert(res.body.data[0].name === 'updatedtestserviceSonly')
    })
  })
})
