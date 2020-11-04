'use strict'

module.exports = app => {
  const { router, controller } = app
  router.resources('orders', '/orders', controller.oms.order)
  router.resources(
    'productInstances',
    '/productInstances',
    controller.oms.product
  )
  router.get('/orders/:id/logs', controller.oms.order.viewLogs)
  router.get(
    '/orderHistory/productInstance/:productInstanceId',
    controller.oms.order.fetchOrdersByProductInstance
  )
}
