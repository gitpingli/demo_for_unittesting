'use strict'
const { assert, app } = require('egg-mock/bootstrap')

describe('test/app/controller/singlespa.test.js service CRUD', () => {
  describe('/singlespas', () => {
    let singlespaId,
      serviceName
    it('should create a new singlespa', async () => {
      app.mockCsrf()
      let res = await app
        .httpRequest()
        .post('/singlespas')
        .send({
          name: 'testsinglespas5',
          url:
            'https://external-dm.dev.core.consoleconnect.com/heartbeat',
          active: true
        })

      assert(res.status === 200)
      assert(res.body.data.id)

      res = await app
        .httpRequest()
        .get(`/singlespas/${res.body.data.id}`)
      assert(res.status === 200)
      assert(res.body.data.name === 'testsinglespas5')
      singlespaId = res.body.data.id
      serviceName = res.body.data.name
    })

    it('should list singlespas', async () => {
      const res = await app.httpRequest().get('/singlespas?page=1&pageSize=10')
      assert(res.status === 200)
      assert(res.body.data.length > 0)
      assert(res.body.meta)
    })

    it('should get singlespa by id', async () => {
      const res = await app.httpRequest().get(`/singlespas/${singlespaId}`)
      assert(res.status === 200)
      assert(res.body.data.name === serviceName)
    })

    it('should list all acitve singlespas length > 0', async () => {
      const res = await app.httpRequest().get('/singlespa/findActive')
      assert(res.status === 200)
      assert(res.body.data.length > 0)
      assert(res.body.meta)
    })
    it('should update a existing singlespa', async () => {
      const res = await app
        .httpRequest()
        .patch(`/singlespas/${singlespaId}`)
        .send({
          name: 'testsinglespas51',
          url:
              'https://external-dm.dev.core.consoleconnect.com/heartbeat',
          active: false
        })
      assert(res.status === 200)
      assert(res.body.data.name === 'testsinglespas51')
      assert(res.body.data.active === false)
    })

    it('should list all acitve singlespas length === 0', async () => {
      const res = await app.httpRequest().get('/singlespa/findActive')
      assert(res.status === 200)
      assert(res.body.data.length === 0)
      assert(res.body.meta)
    })

    it('should delete a undeleted service', async () => {
      const res = await app
        .httpRequest()
        .delete(`/singlespas/${singlespaId}`)

      assert(res.status === 200)
      assert(res.body.data.name === 'testsinglespas51')
      assert(res.body.data.deleted === true)
    })
  })
})
