'use strict'

const TykService = require('./tyk')

// https://tyk.io/docs/tyk-dashboard-api/api-keys/
class KeyService extends TykService {
  async fetchListResouces (resouces, key) {
    const { ctx } = this
    const lists = await Promise.all(
      resouces.map(async id => {
        return await ctx.model[key].findOne({ where: { id } })
      })
    )
    if (lists.some(item => item === null || item.deleted === true)) {
      this.ctx.throw(
        400,
        `one of ${key}s has been deleted or not exists, can not associate a key with it`
      )
    }
    return lists
  }

  async create (key) {
    // TODO: key can not be associate with deleted app and service
    const { ctx } = this
    ctx.logger.info('key create payload: %j', key)

    // serviceIds and policyIds can not be empty at the same time.
    if ([key.serviceIds, key.policyIds].every(val => val.length === 0)) {
      this.ctx.throw(400, 'must specify one service or policy for key')
    }
    let application
    let policies = []
    let services = []
    let appliedPolicies = []
    const accessRights = {}
    try {
      application = await ctx.service.gateway.application.findById(
        key.applicationId
      )
    } catch (error) {
      ctx.throw(400, 'application not found')
    }

    if (application.deleted) {
      this.ctx.throw(
        400,
        'application has been deleted, can not associate a key with it'
      )
    }

    // policy overides service.
    if (Array.isArray(key.policyIds) && key.policyIds.length !== 0) {
      policies = await this.fetchListResouces(key.policyIds, 'Policy')
      // get services from policies.accessRights
      await Promise.all(
        policies.map(async p => {
          services.push(
            await this.fetchListResouces(
              p.accessRights.map(obj => obj.serviceId),
              'Service'
            )
          )
        })
      )
      // to 1D array
      services = [].concat.apply([], services)
      // remove duplicates
      services = [...new Set(services)]
      appliedPolicies = policies.map(p => p.policyId)
    } else {
      services = await this.fetchListResouces(key.serviceIds, 'Service')
    }
    // assamble accessRights based on the services
    services.forEach(
      item =>
        (accessRights[item.apiId] = {
          api_id: item.apiId,
          api_name: item.name,
          versions: ['Default']
        })
    )

    const keyConfig = {
      last_check: 0,
      // please check PLATPO-220, allowance should same with rate
      allowance: 1000,
      rate: 1000,
      per: 60,
      expires: 0,
      quota_max: -1,
      apply_policies: appliedPolicies,
      access_rights: accessRights
    }
    ctx.logger.info('tyk key config create payload: %j', keyConfig)

    let options
    try {
      const data = await this.curl({
        method: 'POST',
        endpoint: '/keys',
        payload: keyConfig
      })
      ctx.logger.info('tyk key create responds: %j', data)

      options = {
        hash: data.key_hash,
        value: data.key_id,
        applicationId: key.applicationId
      }
    } catch (error) {
      ctx.logger.error('tyk key create error: %j', error)
      this.ctx.throw(400, `key can not be created: ${error}`)
    }

    try {
      const newKey = await ctx.model.Key.create(options)
      await newKey.setPolicies(policies)
      await newKey.setServices(services)
      return newKey
    } catch (error) {
      this.ctx.throw(400, `key can not be created: ${error}`)
    }
  }

  async list (query) {
    // trim undefined
    const filter = {}
    if (query.deleted !== undefined) {
      filter.deleted = query.deleted
    }
    return await this.ctx.model.Key.findAll({ where: filter })
  }

  async findById (id) {
    const key = await this.ctx.model.Key.findOne({
      where: { id },
      include: [
        {
          model: this.ctx.model.Service,
          // show active service
          // where: { active: true },
          // Hide unwanted `servicekeys` nested object from results
          through: { attributes: [] }
        },
        {
          model: this.ctx.model.Policy,
          through: { attributes: [] }
        }
      ]
    })
    if (!key) {
      this.ctx.throw(400, `key not found by ${id}`)
    }
    return key
  }

  async update (values, id) {
    const { ctx } = this

    ctx.logger.info('key update payload: %j', values)
    const exstingKey = await this.ctx.model.Key.findOne({ where: { id } })
    if (exstingKey.deleted) this.ctx.throw(400, 'Key has been deleted already')
    // both applicationId and serviceIds can NOT be empty
    // get application based on payload
    try {
      await ctx.service.gateway.application.findById(values.applicationId)
    } catch (error) {
      ctx.throw(400, 'application not found')
    }
    let policies = []
    let services = []
    let appliedPolicies = []
    const accessRights = {}
    // serviceIds and policyIds can not be empty at the same time.
    if (
      [values.serviceIds, values.policyIds].every(val => val.length === 0)
    ) {
      this.ctx.throw(400, 'must specify one service or policy for key')
    }

    // get services based on payload
    // FIXME: service has to be active
    // policy overides service, get services based on payload
    if (Array.isArray(values.policyIds) && values.policyIds.length !== 0) {
      policies = await this.fetchListResouces(values.policyIds, 'Policy')
      // get services from policies.accessRights
      await Promise.all(
        policies.map(async p => {
          services.push(
            await this.fetchListResouces(
              p.accessRights.map(obj => obj.serviceId),
              'Service'
            )
          )
        })
      )
      // to 1D array
      services = [].concat.apply([], services)
      // remove duplicates
      services = [...new Set(services)]
      appliedPolicies = policies.map(p => p.policyId)
    } else {
      services = await this.fetchListResouces(values.serviceIds, 'Service')
    }

    services.forEach(
      item =>
        (accessRights[item.apiId] = {
          api_id: item.apiId,
          api_name: item.name,
          versions: ['Default']
        })
    )

    // iter through each service
    await Promise.all(
      services.map(async item => {
        const keyConfig = {
          last_check: 0,
          // please check PLATPO-220, allowance should same with rate
          allowance: 1000,
          rate: 1000,
          per: 60,
          expires: 0,
          quota_max: -1,
          apply_policies: appliedPolicies,
          access_rights: accessRights,
          org_id: this.config.gateway.orgId
        }

        ctx.logger.info('tyk key config update payload: %j', keyConfig)

        try {
          const data = await this.curl({
            method: 'PUT',
            endpoint: `/apis/${item.apiId}/keys/${exstingKey.value}?suppress_reset=0`,
            payload: keyConfig
          })
          ctx.logger.info('tyk key update responds: %j', data)
        } catch (error) {
          ctx.logger.error('tyk key update error: %j', error)
          ctx.throw(400, `key can not be updated: ${error.data.Message}`)
        }
      })
    )

    const options = {
      applicationId: values.applicationId
    }

    try {
      await exstingKey.update(options)
      await exstingKey.setPolicies(policies)
      await exstingKey.setServices(services)
    } catch (error) {
      this.ctx.throw(400, `key can not be updated: ${error}`)
    }

    // query again to get the updated key
    return await this.findById(id)
  }

  async destroy (id) {
    const key = await this.ctx.model.Key.findOne({ where: { id } })
    if (!key) {
      this.ctx.throw(400, `key not found by ${id}`)
    }

    if (key.deleted) this.ctx.throw(400, 'key has been deleted already')

    // find the first service though key.
    const services = await key.getServices()

    try {
      try {
        await this.curl({
          method: 'DELETE',
          endpoint: `/apis/${services[0].apiId}/keys/${key.value}`
        })
      } catch (error) {
        this.ctx.logger.error('tyk key delete error: %j', error)
        this.ctx.throw(400, `key can not be deleted: ${error}`)
      }

      // when delete key, not unlink all the policies and services
      // use same method as service does
      return await key.update({ deleted: true })
    } catch (error) {
      this.ctx.throw(400, `key can not be deleted: ${error}`)
    }
  }
}

module.exports = KeyService
