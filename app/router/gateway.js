'use strict'

module.exports = app => {
  const { router, controller } = app
  const { gateway } = controller
  router.resources('Services', '/gateway/services', gateway.service)
  router.resources('Keys', '/gateway/keys', gateway.key)
  router.resources(
    'Applications',
    '/gateway/applications',
    gateway.application
  )
  router.resources('Policies', '/gateway/policies', gateway.policy)

  router.get('/gateway/dashboard/services', gateway.dashboard.usageOfServices)
  router.get('/gateway/dashboard/tops', gateway.dashboard.usageOfTops)
  router.get('/gateway/dashboard/breakdown', gateway.dashboard.usageBreakdown)
  router.get('/gateway/dashboard/applications/:id', gateway.dashboard.usageOfOneApplication)
}
