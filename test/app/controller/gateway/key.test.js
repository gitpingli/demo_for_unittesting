'use strict'
const { assert, app } = require('egg-mock/bootstrap')

function delay (interval) {
  return it('should delay', done => {
    setTimeout(() => done(), interval)
  }).timeout(interval + 100)
}

describe.skip('test/app/controller/keys.test.js', () => {
  let application,
    service1,
    service2,
    policy,
    keyId,
    keyValue
  describe('/keys', () => {
    before(async () => {
      application = await app.factory.createMany('application', 1)

      app.mockCsrf()
      service1 = await app
        .httpRequest()
        .post('/gateway/services')
        .send({
          name: 'testservice1forkey',
          targetUrl: 'https://external-dm.dev.core.consoleconnect.com',
          accessSlug: 'testservice1forkey',
          provideBy: 'unitest'
        })
      assert(service1.status === 200)

      service2 = await app
        .httpRequest()
        .post('/gateway/services')
        .send({
          name: 'testservice2forkey',
          targetUrl: 'https://api.github.com',
          accessSlug: 'testservice2forkey',
          provideBy: 'unitest'
        })
      assert(service2.status === 200)

      // create the policy
      policy = await app
        .httpRequest()
        .post('/gateway/policies')
        .send({
          name: 'testpolicy1forkey',
          accessRights: [
            {
              serviceId: service1.body.data.id.toString(),
              allowedUrls: [
                {
                  methods: ['GET'],
                  url: '/heartbeat'
                }
              ]
            }
          ]
        })
      assert(policy.status === 200)
      assert(policy.body.data.id)

      // update policy
      const updatedPolicy = await app
        .httpRequest()
        .patch(`/gateway/policies/${policy.body.data.id}`)
        .send({
          name: 'testpolicy1forkey',
          accessRights: [
            {
              serviceId: service1.body.data.id.toString(),
              allowedUrls: [
                {
                  methods: ['GET'],
                  url: '/docs'
                },
                {
                  methods: ['GET'],
                  url: '/heartbeat'
                }
              ]
            },
            {
              serviceId: service2.body.data.id.toString(),
              allowedUrls: [
                {
                  methods: ['GET'],
                  url: '/feeds'
                }
              ]
            }
          ]
        })
      assert(updatedPolicy.status === 200)
    })

    after(async () => {
      await Promise.all([
        app.httpRequest().delete(`/gateway/services/${service1.body.data.id}`),
        app.httpRequest().delete(`/gateway/services/${service2.body.data.id}`),
        app.httpRequest().delete(`/gateway/policies/${policy.body.data.id}`)
      ])
    })

    it('should create a new key', async () => {
      app.mockCsrf()
      const res = await app
        .httpRequest()
        .post('/gateway/keys')
        .send({
          applicationId: `${application[0].id}`,
          serviceIds: [`${service1.body.data.id}`, `${service2.body.data.id}`],
          policyIds: []
        })

      assert(res.status === 200)
      assert(res.body.data.id)
      assert(res.body.data.hash)
      assert(res.body.data.value)
      assert(res.body.data.deleted === false)
      keyId = res.body.data.id
      keyValue = res.body.data.value
    })

    it('should list keys', async () => {
      const res = await app
        .httpRequest()
        .get('/gateway/keys?page=1&pageSize=10')
      assert(res.status === 200)
      assert(res.body.data.length > 0)
      assert(res.body.data[0].hash)
      assert(res.body.data[0].value === keyValue)
    })

    it('should get key by id', async () => {
      const res = await app.httpRequest().get(`/gateway/keys/${keyId}`)
      assert(res.status === 200)
      assert(res.body.data.hash)
      assert(res.body.data.value === keyValue)
      assert(res.body.data.deleted === false)
      assert(res.body.data.applicationId === application[0].id)
      const sIds = res.body.data.services.map(s => s.id)
      assert(sIds[0] === service1.body.data.id)
      assert(sIds[1] === service2.body.data.id)
    })

    delay(15000) // delay 15s because PLATPO-666

    it('should update a existing key', async () => {
      const res = await app
        .httpRequest()
        .patch(`/gateway/keys/${keyId}`)
        .send({
          applicationId: `${application[0].id}`,
          serviceIds: [`${service1.body.data.id}`],
          policyIds: []
        })
      assert(res.status === 200)
      assert(res.body.data.hash)
      assert(res.body.data.value === keyValue)
      assert(res.body.data.deleted === false)
      assert(res.body.data.applicationId === application[0].id)
      const sIds = res.body.data.services.map(s => s.id)
      assert(sIds[0] === service1.body.data.id)
    })

    it('should delete a undeleted key', async () => {
      const res = await app.httpRequest().delete(`/gateway/keys/${keyId}`)

      assert(res.status === 200)
      assert(res.body.data.hash)
      assert(res.body.data.value === keyValue)
      assert(res.body.data.deleted === true)
      assert(res.body.data.applicationId === application[0].id)
    })
  })
})
