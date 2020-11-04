'use strict'

module.exports = app => {
  const { router, controller } = app
  const { consoleconnect } = controller
  router.resources(
    'consoleconnect ports',
    '/companies/:companyId/consoleconnect/ports',
    consoleconnect.port
  )

  router.resources(
    'consoleconnect connections',
    '/companies/:companyId/consoleconnect/connections',
    consoleconnect.connection
  )

  router.get(
    '/companies/:companyId/consoleconnect/ports/:id/utilization',
    consoleconnect.port.utilization
  )

  router.get(
    '/companies/:companyId/consoleconnect/connections/:id/utilization',
    consoleconnect.connection.utilization
  )
}
