'use strict'
const { assert, app } = require('egg-mock/bootstrap')

describe.skip('Test SONATA productOfferings', () => {
  // it needs login now
  describe('productOfferings', () => {
    let poId
    it('should query list of productOfferings', async () => {
      const res = await app
        .httpRequest()
        .get('/mef/productOfferingManagement/v1/productOffering')
      assert(res.status === 200)
      poId = res.body[0].id
    })

    it('should query a productOffering', async () => {
      const res = await app
        .httpRequest()
        .get(`/mef/productOfferingManagement/v1/productOffering/${poId}`)
      assert(res.status === 200)
      assert(res.body.id === poId)
    })

    it('should query providers', async () => {
      const res = await app
        .httpRequest()
        .get('/mef/productOfferingManagement/v1/providers')
      assert(res.status === 200)
    })
  })
})
