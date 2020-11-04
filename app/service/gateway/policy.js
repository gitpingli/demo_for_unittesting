'use strict'

const TykService = require('./tyk')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// https://tyk.io/docs/tyk-apis/tyk-dashboard-api/portal-policies/
class PolicyService extends TykService {
  validateHTTPMethods (accessRights) {
    const { ctx } = this
    const HTTPMETHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    accessRights.forEach(ar => {
      ar.allowedUrls.forEach(au => {
        if (!au.methods.every(m => HTTPMETHODS.includes(m))) {
          ctx.throw(400, `HTTP methods should in ${HTTPMETHODS}`)
        }
      })
    })
  }

  findAllowedUrls (id, accessRights) {
    const accessRight = accessRights.find(a => {
      return a.serviceId === id.toString()
    })
    return accessRight.allowedUrls
  }

  async create (policyPayload) {
    const { ctx } = this
    ctx.logger.info('policy create payload: %j', policyPayload)
    const defaults = { whitelist: true, active: true, deleted: false }
    const options = Object.assign({}, defaults, policyPayload)

    if (options.accessRights.length === 0) {
      ctx.throw(400, 'must specify at least one service in the policy')
    }
    this.validateHTTPMethods(options.accessRights)
    const services = await Promise.all(
      options.accessRights.map(async item => {
        try {
          return await ctx.model.Service.findOne({
            where: { id: item.serviceId }
          })
        } catch (error) {
          ctx.throw(400, 'service not found')
        }
      })
    )

    if (services.some(s => s.deleted === true)) {
      this.ctx.throw(
        400,
        'one of services has been deleted, can not associate a key with it'
      )
    }

    const accessRights = {}
    services.forEach(item => {
      accessRights[item.apiId] = {
        api_id: item.apiId,
        allowed_urls: this.findAllowedUrls(item.id, options.accessRights) || [],
        api_name: item.name,
        versions: ['Default']
      }
    })

    ctx.logger.info('tyk policy accessRights create payload: %j', accessRights)

    const policyConfig = {
      rate: 1000,
      per: 60,
      quota_max: -1,
      quota_remaining: 0,
      quota_renewal_rate: 60,
      org_id: this.config.gateway.orgId,
      access_rights: accessRights,
      name: options.name,
      is_inactive: !options.active,
      active: options.active
    }
    ctx.logger.info('tyk policy policyConfig create payload: %j', policyConfig)

    try {
      const data = await this.curl({
        method: 'POST',
        endpoint: '/portal/policies',
        payload: policyConfig
      })
      ctx.logger.info('tyk policy create responds: %j', data)
      // policy id from tyk
      options.policyId = data.Message
    } catch (error) {
      ctx.logger.error('tyk policy create error: %j', error)
      this.ctx.throw(400, `policy can not be created: ${error}`)
    }

    try {
      return await ctx.model.Policy.create(options)
    } catch (error) {
      this.ctx.throw(400, `policy can not be created: ${error}`)
    }
  }

  async list (query) {
    // trim undefined
    const filter = {}
    if (query.deleted !== undefined) {
      filter.deleted = query.deleted
    }
    if (query.name !== undefined) {
      filter.name = { [Op.like]: `%${query.name}%` }
    }
    let res = await this.ctx.model.Policy.findAll({
      where: filter,
      include: [
        {
          model: this.ctx.model.Key,
          through: { attributes: [] },
          include: [{ model: this.ctx.model.Application, as: 'application' }]
        }
      ]
    })
    // replace serviceID to service obj in resp
    res = await Promise.all(
      res.map(async p => {
        const jp = p.toJSON()
        await Promise.all(
          jp.accessRights.map(async ar => {
            ar.service = await this.ctx.model.Service.findOne({
              where: { id: ar.serviceId }
            })
            delete ar.serviceId
            return ar
          })
        )
        return jp
      })
    )
    return res
  }

  async findById (id) {
    const policy = await this.ctx.model.Policy.findOne({
      where: { id },
      include: [
        {
          model: this.ctx.model.Key,
          through: { attributes: [] },
          include: [{ model: this.ctx.model.Application, as: 'application' }]
        }
      ]
    })
    if (!policy) {
      this.ctx.throw(400, `policy not found by ${id}`)
    }
    const res = policy.toJSON()
    await Promise.all(
      res.accessRights.map(async ar => {
        ar.service = await this.ctx.model.Service.findOne({
          where: { id: ar.serviceId }
        })
        delete ar.serviceId
        return ar
      })
    )
    return res
  }

  async update (values, id) {
    const { ctx } = this

    ctx.logger.info('policy update payload: %j', values)
    this.validateHTTPMethods(values.accessRights)
    const exstingPolicy = await this.ctx.model.Policy.findOne({
      where: { id }
    })
    if (exstingPolicy.deleted) {
      this.ctx.throw(400, 'Policy has been deleted already')
    }

    // get services based on payload
    // FIXME: service has to be active
    // values.accessRights != {}
    let services = []
    const accessRights = {}
    if (values.accessRights.length !== 0) {
      services = await Promise.all(
        values.accessRights.map(async item => {
          try {
            return await ctx.model.Service.findOne({
              where: { id: item.serviceId }
            })
          } catch (error) {
            ctx.throw(400, 'service not found')
          }
        })
      )

      services.forEach(
        item =>
          (accessRights[item.apiId] = {
            api_id: item.apiId,
            api_name: item.name,
            allowed_urls:
              this.findAllowedUrls(item.id, values.accessRights) || [],
            versions: ['Default']
          })
      )
    }

    ctx.logger.info('tyk policy accessRights update payload: %j', accessRights)

    const policyConfig = {
      rate: 1000,
      per: 60,
      quota_max: -1,
      quota_remaining: 0,
      quota_renewal_rate: 60,
      _id: exstingPolicy.policyId,
      org_id: this.config.gateway.orgId,
      access_rights: accessRights,
      name: values.name,
      is_inactive: Object.prototype.hasOwnProperty.call(values, 'active')
        ? !values.active
        : !exstingPolicy.active,
      active: Object.prototype.hasOwnProperty.call(values, 'active')
        ? values.active
        : exstingPolicy.active
    }
    ctx.logger.info('tyk policy policyConfig create payload: %j', policyConfig)

    try {
      const data = await this.curl({
        method: 'PUT',
        endpoint: `/portal/policies/${exstingPolicy.policyId}`,
        payload: policyConfig
      })
      ctx.logger.info('tyk policy update responds: %j', data)
    } catch (error) {
      ctx.logger.error('tyk policy update error: %j', error)
      ctx.throw(400, `policy can not be updated: ${error.data.Message}`)
    }

    try {
      // policy linked to a key, and updated the service related to the policy
      // set key service according to policy
      const keysWithP = await exstingPolicy.getKeys()
      await Promise.all(
        keysWithP.map(async k => await k.setServices(services))
      )

      await exstingPolicy.update(values)
    } catch (error) {
      this.ctx.throw(400, `policy can not be updated: ${error}`)
    }

    // query again to get the updated policy
    return await this.findById(id)
  }

  async destroy (id) {
    const policy = await this.ctx.model.Policy.findOne({ where: { id } })
    if (!policy) {
      this.ctx.throw(400, `policy not found by ${id}`)
    }

    if (policy.deleted) this.ctx.throw(400, 'policy has been deleted already')

    // check related keys, if not all deleted, can not delete policy.
    const keys = await policy.getKeys()
    if (keys.some(k => k.deleted === false)) {
      this.ctx.throw(
        400,
        'keys are associate with this policy, can not delete the policy'
      )
    }

    try {
      try {
        await this.curl({
          method: 'DELETE',
          endpoint: `/portal/policies/${policy.policyId}`
        })
      } catch (error) {
        this.ctx.logger.error('tyk policy delete error: %j', error)
        this.ctx.throw(400, `policy can not be deleted: ${error}`)
      }

      return await policy.update({ deleted: true })
    } catch (error) {
      this.ctx.throw(400, `policy can not be deleted: ${error}`)
    }
  }
}

module.exports = PolicyService
