'use strict'
const { assert, app } = require('egg-mock/bootstrap')

describe('test/app/controller/applications.test.js', () => {
  describe('GET /applications', () => {
    it('should list applications', async () => {
      await app.factory.createMany('application', 3)
      const res = await app.httpRequest().get('/gateway/applications?page=1&pageSize=10')
      assert(res.status === 200)
      assert(res.body.data.length = 3)
      assert(res.body.data[0].name)
      assert(res.body.data[0].owner)
    })

    it('should list applications by name', async () => {
      const res = await app.httpRequest().get('/gateway/applications?page=1&pageSize=10&name=app_1')
      assert(res.status === 200)
      assert(res.body.data.length === 1)
      assert(res.body.data[0].name === 'app_1')
      assert(res.body.data[0].owner)
    })

    it('should list applications by fuzzy name and deleted', async () => {
      const res = await app.httpRequest().get('/gateway/applications?page=1&pageSize=10&name=app&deleted=true')
      assert(res.status === 200)
      assert(res.body.data.length === 0)
    })

    it('should list applications by fuzzy name and undeletd', async () => {
      const res = await app.httpRequest().get('/gateway/applications?name=app&deleted=false')
      assert(res.status === 200)
      assert(res.body.data.length === 3)
    })
  })

  describe('GET /applications/:id', () => {
    it('should get application by id', async () => {
      const application = await app.factory.create('application')
      const res = await app
        .httpRequest()
        .get(`/gateway/applications/${application.id}`)
      assert(res.status === 200)
      assert(res.body.data.owner === application.owner)
      assert(res.body.data.keys)
    })
  })

  describe('POST /applications', () => {
    it('should create a new application', async () => {
      app.mockCsrf()
      let res = await app
        .httpRequest()
        .post('/gateway/applications')
        .send({
          name: 'testname',
          owner: 'test'
        })
      assert(res.status === 200)
      assert(res.body.data.id)

      res = await app
        .httpRequest()
        .get(`/gateway/applications/${res.body.data.id}`)
      assert(res.status === 200)
      assert(res.body.data.name === 'testname')
    })
  })

  describe('PATCH /applications', () => {
    it('should update a existing application', async () => {
      app.mockCsrf()
      let res = await app
        .httpRequest()
        .post('/gateway/applications')
        .send({
          name: 'testname1',
          owner: 'testowner'
        })
      assert(res.status === 200)
      assert(res.body.data.id)

      res = await app
        .httpRequest()
        .patch(`/gateway/applications/${res.body.data.id}`)
        .send({
          name: 'updatedname1',
          owner: 'updatedtestowner'
        })
      assert(res.status === 200)
      assert(res.body.data.name === 'updatedname1')
      assert(res.body.data.owner === 'updatedtestowner')
    })
  })

  describe('Delete /applications', () => {
    it('should delete an application', async () => {
      app.mockCsrf()
      let res = await app
        .httpRequest()
        .post('/gateway/applications')
        .send({
          name: 'test2delete',
          owner: 'test2deleteowner'
        })
      assert(res.status === 200)
      assert(res.body.data.id)

      res = await app
        .httpRequest()
        .delete(`/gateway/applications/${res.body.data.id}`)
      assert(res.status === 200)
      assert(res.body.data.deleted === true)
    })
  })
})
