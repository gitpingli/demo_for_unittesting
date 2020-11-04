'use strict'

const Controller = require('egg').Controller
/**
 * @Controller Workflow_Versions Management
 */
class WorkflowVersionsController extends Controller {
  async curl (method, endpoint, payload) {
    const { ctx } = this
    const req = {
      name: 'workflow',
      method,
      endpoint,
      payload
    }
    return await ctx.service.backend.curl(req)
  }

  /**
   * @Summary List a deployed bpmn versions
   * @Router GET /workflows/{bpmnProcessId}/versions
   * @Response 200
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const { bpmnProcessId } = ctx.params

    const versions = await this.curl('GET', `/workflows/v1/bpmnProcesses/${bpmnProcessId}`)

    ctx.body = {
      data: versions.workflows
    }
  }
}

module.exports = WorkflowVersionsController
