'use strict'

module.exports = app => {
  const { router, controller } = app
  router.get('/mef/quoteManagement/v2/quote', controller.sonata.quote.index)
  router.get('/mef/quoteManagement/v2/quote/:id', controller.sonata.quote.show)
  router.post('/mef/quoteManagement/v2/quote', controller.sonata.quote.create)
  router.get(
    '/mef/productOrderManagement/v3/productOrder',
    controller.sonata.productOrder.index
  )
  router.get(
    '/mef/productOrderManagement/v3/productOrder/:id',
    controller.sonata.productOrder.show
  )
  router.post(
    '/mef/productOrderManagement/v3/productOrder',
    controller.sonata.productOrder.create
  )
  router.get(
    '/mef/productOfferingManagement/v1/productOffering',
    controller.sonata.productOffering.index
  )
  router.get(
    '/mef/productOfferingManagement/v1/productOffering/:id',
    controller.sonata.productOffering.show
  )
  router.get(
    '/mef/productOfferingManagement/v1/providers',
    controller.sonata.productOffering.getOfferingProviders
  )
  router.get(
    '/mef/productInventoryManagement/v3/product',
    controller.sonata.productInventory.index
  )
  router.get(
    '/mef/productInventoryManagement/v3/product/:id',
    controller.sonata.productInventory.show
  )
}
