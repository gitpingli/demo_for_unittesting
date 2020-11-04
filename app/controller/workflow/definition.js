'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Workflow_Definition Management
 */
class WorkflowDeploymentController extends Controller {
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
   * @Summary List all deployed bpmns
   * @Router GET /workflows/definitions
   * @Request query string pageSize
   * @Request query string page
   * @Response 200
   * @Response 500 error Unknown internal server error
   */
  async index () {
    const { ctx } = this
    const query = {
      pageSize: ctx.helper.toInt(ctx.query.pageSize ? ctx.query.pageSize : 10),
      page: ctx.helper.toInt(ctx.query.page ? ctx.query.page : 1)
    }
    const response = await this.curl('GET', `/workflows/v1?page=${query.page}&pageSize=${query.pageSize}`)
    const workflows = response.workflows
    const result = await Promise.all(_.map(workflows, async workflow => {
      const bpmnProcessId = workflow.sourceAsMap.value.deployedWorkflows[0].bpmnProcessId
      const workflowKey = workflow.sourceAsMap.value.deployedWorkflows[0].workflowKey
      const version = workflow.sourceAsMap.value.deployedWorkflows[0].version
      const workflowInstances = await this.curl('GET', `/workflowInstances/v1/bpmnProcesses/${bpmnProcessId}/${version}`)
      const workflowIncidents = await this.curl('GET', `/incidents/v1/bpmnProcesses/${bpmnProcessId}/${workflowKey}`)
      return {
        workflow: {
          workflowKey: workflow.sourceAsMap.value.deployedWorkflows[0].workflowKey,
          bpmnProcessId: workflow.sourceAsMap.value.deployedWorkflows[0].bpmnProcessId,
          version: workflow.sourceAsMap.value.deployedWorkflows[0].version,
          resource: workflow.sourceAsMap.value.resources[0].resource
        },
        instances: workflowInstances.workflowInstances,
        incidents: workflowIncidents.workflowIncidents
      }
    }))
    const meta = {
      total: response.total,
      page: query.page,
      per_page: query.pageSize
    }
    ctx.body = {
      meta,
      data: result
    }
  }

  /**
   * @Summary Get a bpmn by key
   * @Router GET /workflows/definitions/{id}
   * @Request path string *id
   * @Request query string pageSize
   * @Request query string page
   * @Response 200
   * @Response 404
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params

    const [bpmnProcessId, version] = id.split('-')

    const originWorkflow = await this.curl('GET', `/workflows/v1/bpmnProcesses/${bpmnProcessId}/versions/${version}`)
    const originWorkflowInstances = await this.curl('GET', `/workflowInstances/v1/bpmnProcesses/${bpmnProcessId}/${version}`)
    const result = [{
      workflow: {
        workflowKey: originWorkflow.workflows[0].value.deployedWorkflows[0].workflowKey,
        bpmnProcessId: originWorkflow.workflows[0].value.deployedWorkflows[0].bpmnProcessId,
        version: originWorkflow.workflows[0].value.deployedWorkflows[0].version,
        resource: originWorkflow.workflows[0].value.resources[0].resource
      },
      instances: _.map(originWorkflowInstances.workflowInstances, workflowInstance => {
        return {
          workflowInstanceKey: workflowInstance.value.workflowInstanceKey
        }
      })
    }]
    ctx.body = {
      data: result
    }
  }

  /**
   * @Summary Deployment a bpmn
   * @Router POST /workflows/definitions
   * @Request body string *body
   * @Response 200
   */
  async create () {
    const { ctx } = this
    const fs = require('fs')
    // ctx.validate(ctx.rule.createUserPayload, ctx.request.body);
    const file = ctx.request.files[0]
    ctx.logger.info('%j', file)
    const contents = fs.readFileSync(file.filepath, 'utf8')

    try {
      ctx.body = {
        data: await this.curl('POST', '/workflows/v1/resources/xml', contents)
      }
    } finally {
      // remove tmp files and don't block the request's response
      // cleanupRequestFiles won't throw error even remove file io error happen
      ctx.cleanupRequestFiles([file])
    }
  }
}

module.exports = WorkflowDeploymentController
