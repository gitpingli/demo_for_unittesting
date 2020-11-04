'use strict'

const Controller = require('egg').Controller
const _ = require('lodash')
/**
 * @Controller Workflow_Worker Management
 */
class WorkflowWorkerController extends Controller {
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
   * @Router GET /workflows/workers
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
    const jobs = await this.curl('GET', '/jobworkers/v1')
    const result = await Promise.all(_.map(jobs, async job => {
      return {
        job: {
          jobId: job.key,
          elementId: job.value.workflowKey,
          bpmnProcessId: job.value.bpmnProcessId,
          workflowDefinitionVersion: job.value.workflowDefinitionVersion,
          type: job.value.type,
          elementInstanceKey: job.value.elementInstanceKey,
          workflowKey: job.value.workflowKey,
          workflowInstanceKey: job.value.workflowInstanceKey,
          retries: job.value.retries,
          variables: job.value.variables,
          errorMessage: job.value.errorMessage,
          errorCode: job.value.errorCode,
          customHeaders: job.value.customHeaders
        }
      }
    }))
    const meta = {
      total: result.length,
      page: query.page,
      per_page: query.pageSize
    }
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    ctx.body = {
      data: _.slice(result, start, end),
      meta
    }
  }

  /**
   * @Summary Get a  worker by id
   * @Router GET /workflows/workers/{id}
   * @Request path string *id
   * @Response 200
   * @Response 404
   * @Response 500 error Unknown internal server error
   */
  async show () {
    const { ctx } = this
    const { id } = ctx.params
    const jobs = await this.curl('GET', `/jobworkers/v1/${id}`)
    const result = await Promise.all(_.map(jobs, async job => {
      return {
        job: {
          jobId: job.key,
          elementId: job.value.workflowKey,
          bpmnProcessId: job.value.bpmnProcessId,
          workflowDefinitionVersion: job.value.workflowDefinitionVersion,
          type: job.value.type,
          elementInstanceKey: job.value.elementInstanceKey,
          workflowKey: job.value.workflowKey,
          workflowInstanceKey: job.value.workflowInstanceKey,
          retries: job.value.retries,
          variables: job.value.variables,
          errorMessage: job.value.errorMessage,
          errorCode: job.value.errorCode,
          customHeaders: job.value.customHeaders
        }
      }
    }))
    ctx.body = result
  }

  /**
   * @Summary Create a worker
   * @Router POST /workflows/workers
   * @Request query string jobType
   * @Request body workerModel *body
   * @Response 200
   */
  async create () {
    const { ctx } = this
    ctx.validate(ctx.rule.workerModel, ctx.request.body)

    let endpoint = '/jobworkers/v1'

    if (ctx.query) {
      const querystring = require('querystring')
      const q = querystring.stringify(ctx.query)
      ctx.logger.info('q:%s', q)
      endpoint = endpoint + `?${q}`
    }

    ctx.body = {
      data: await this.curl('POST', endpoint, ctx.request.body)
    }
  }
}

module.exports = WorkflowWorkerController
