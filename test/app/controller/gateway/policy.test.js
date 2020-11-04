'use strict'
const { assert, app } = require('egg-mock/bootstrap')

describe('test/app/controller/poilcy.test.js policy CRUD', () => {
  describe('/policies', () => {
    let serviceId,
      policyId,
      policyName
    it('should create a new policy', async () => {
      app.mockCsrf()
      // create a service
      let res = await app
        .httpRequest()
        .post('/gateway/services')
        .send({
          name: 'testpolicyservice1',
          targetUrl:
            'https://external-dm.dev.core.consoleconnect.com/heartbeat',
          accessSlug: 'policytest1',
          provideBy: 'policyunitest'
        })

      assert(res.status === 200)
      assert(res.body.data.id)

      res = await app
        .httpRequest()
        .get(`/gateway/services/${res.body.data.id}`)
      assert(res.status === 200)
      assert(res.body.data.name === 'testpolicyservice1')
      serviceId = res.body.data.id

      // create the policy
      let policyRes = await app
        .httpRequest()
        .post('/gateway/policies')
        .send({
          name: 'testpolicy1',
          accessRights: [
            {
              serviceId: serviceId.toString(),
              allowedUrls: [
                {
                  methods: ['GET'],
                  url: '/heartbeat'
                },
                {
                  methods: ['GET'],
                  url: '/events'
                }
              ]
            }
          ]
          // active: true,
          // deleted: false,
        })
      assert(policyRes.status === 200)
      assert(policyRes.body.data.id)

      // get the policy
      policyRes = await app
        .httpRequest()
        .get(`/gateway/policies/${policyRes.body.data.id}`)
      assert(policyRes.status === 200)
      assert(policyRes.body.data.name === 'testpolicy1')
      policyId = policyRes.body.data.id
      policyName = policyRes.body.data.name
    })

    it('should list policies', async () => {
      const res = await app.httpRequest().get('/gateway/policies?page=1&pageSize=10')
      assert(res.status === 200)
      assert(res.body.data.length > 0)
      assert(res.body.data[0].policyId)
      assert(res.body.data[0].accessRights)
      assert(res.body.data[0].keys)
    })

    it('should get policy by id', async () => {
      const res = await app.httpRequest().get(`/gateway/policies/${policyId}`)
      assert(res.status === 200)
      assert(res.body.data.name === policyName)
      assert(res.body.data.policyId)
      assert(res.body.data.accessRights)
      assert(res.body.data.keys)
    })

    it('should update a existing policy', async () => {
      const res = await app
        .httpRequest()
        .patch(`/gateway/policies/${policyId}`)
        .send({
          name: 'updatetestpolicy1POnly',
          accessRights: [
            {
              serviceId: serviceId.toString(),
              allowedUrls: [
                {
                  methods: ['GET'],
                  url: '/events'
                }
              ]
            }
          ]
          // active: true,
          // deleted: false,
        })
      assert(res.status === 200)
      assert(res.body.data.name === 'updatetestpolicy1POnly')
      assert(res.body.data.active === true)
      assert(res.body.data.accessRights[0].allowedUrls[0].url === '/events')
      assert(res.body.data.accessRights[0].service.name === 'testpolicyservice1')
      assert(res.body.data.policyId)
    })

    it('should failed update a policy when HTTP method is not right', async () => {
      const res = await app
        .httpRequest()
        .patch(`/gateway/policies/${policyId}`)
        .send({
          name: 'updatetestpolicy1POnly',
          accessRights: [
            {
              serviceId: serviceId.toString(),
              allowedUrls: [
                {
                  methods: ['DELETED'],
                  url: '/events'
                }
              ]
            }
          ]
          // active: true,
          // deleted: false,
        })
      assert(res.status === 400)
    })

    it('should delete a undeleted policy', async () => {
      let res = await app.httpRequest().delete(`/gateway/policies/${policyId}`)

      assert(res.status === 200)
      assert(res.body.data.name === 'updatetestpolicy1POnly')
      assert(res.body.data.active === true)
      assert(res.body.data.deleted === true)
      assert(res.body.data.policyId)

      // delete the service
      res = await app.httpRequest().delete(`/gateway/services/${serviceId}`)

      assert(res.status === 200)
    })

    it('should list policies by fuzzy name and deleted', async () => {
      const res = await app.httpRequest().get('/gateway/policies?page=1&pageSize=10&name=POnly&deleted=true')
      assert(res.status === 200)
      assert(res.body.data.length === 1)
      assert(res.body.data[0].name === 'updatetestpolicy1POnly')
      assert(res.body.data[0].policyId)
    })

    it('should list policies by fuzzy name and undeleted', async () => {
      const res = await app.httpRequest().get('/gateway/policies?page=1&pageSize=10&name=POnly&deleted=false')
      assert(res.status === 200)
      assert(res.body.data.length === 0)
    })
  })
})
