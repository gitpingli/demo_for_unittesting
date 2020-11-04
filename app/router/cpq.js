'use strict'

module.exports = app => {
  const { router, controller } = app
  router.resources('products', '/products', controller.cpq.product)
  router.resources('offerings', '/offerings', controller.cpq.offering)
  router.resources('quotes', '/quotes', controller.cpq.quote)
}
