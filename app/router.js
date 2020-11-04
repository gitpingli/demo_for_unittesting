'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  app.router.redirect('/', '/swagger-ui.html', 302)
  app.socket = app.io.of('/')
  router.get('/heartbeat', controller.heartbeat.show)
  router.get('/heartbeat/:service', controller.heartbeat.getByService)

  router.get('endpointdocs', '/endpointdocs', controller.endpoint.docs)
  router.resources('apis', '/apis', controller.apis)
  router.resources('roles', '/roles', controller.role)

  router.resources('agents', '/agents', controller.ums.agent)
  router.resources('users', '/users', controller.ums.user)
  router.resources('companies', '/companies', controller.ums.company)
  router.resources(
    'wallets',
    '/companies/:companyId/wallets',
    controller.ums.wallet
  )
  router.resources(
    'externals',
    '/companies/:companyId/externals',
    controller.ums.external
  )
  router.resources(
    'members',
    '/companies/:companyId/members',
    controller.ums.member
  )

  router.post('/login', controller.ums.auth.login)
  router.post('/logout', controller.ums.auth.logout)
  router.get('/loggedInUser', controller.ums.auth.loggedInUser)

  require('./router/gateway')(app)
  require('./router/rpc')(app)
  require('./router/sonata')(app)
  require('./router/oms')(app)
  require('./router/consoleconnect')(app)
  require('./router/cpq')(app)

  router.post('/qlc/services', controller.qlc.rpc.process)

  router.resources('contracts', '/contracts', controller.contract)

  router.resources(
    'workflow definitions',
    '/workflows/definitions',
    controller.workflow.definition
  )
  router.resources(
    'workflow versions',
    '/workflows/:bpmnProcessId/versions',
    controller.workflow.versions
  )
  router.resources(
    'workflow worker',
    '/workflows/workers',
    controller.workflow.worker
  )

  router.resources(
    'productInstances',
    '/productinstances',
    controller.oms.product
  )

  router.resources('singlespas', '/singlespas', controller.singlespa)
  router.get('findActive', '/singlespa/findActive', controller.singlespa.findActive)
}
