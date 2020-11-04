'use strict'

const TykService = require('./tyk')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// https://tyk.io/docs/tyk-dashboard-api/api-definitions/
class ServiceService extends TykService {
  validateProtocols (targetUrl) {
    const protocols = ['http', 'https', 'tcp', 'tls', 'tyk']

    const isValidateProtocols = protocols.some(p =>
      targetUrl.startsWith(`${p}://`)
    )
    if (!isValidateProtocols) {
      return this.ctx.throw(400, 'invalid protocols for the target url')
    }
  }

  validateAccessSlug (accessSlug) {
    const patten = /^\/+/
    const match = new RegExp(patten, 'g').test(accessSlug)
    if (match) {
      return this.ctx.throw(400, 'invalid access slug, no leading / allowed')
    }
  }

  async create (service) {
    this.ctx.logger.info('service create payload: %j', service)
    const defaults = { authMode: true, active: true, deleted: false }
    const options = Object.assign({}, defaults, service)

    this.validateProtocols(options.targetUrl)
    this.validateAccessSlug(options.accessSlug)
    // TODO: this part need to be rewrite as a wrapper
    const apiDefinintion = {
      api_definition: {
        name: options.name,
        auth: {
          auth_header_name: 'X-API-Key'
        },
        definition: {
          location: 'header',
          key: ''
        },
        proxy: {
          target_url: options.targetUrl
        },
        version_data: {
          use_extended_paths: true,
          not_versioned: true,
          versions: {
            Default: {
              expires: '',
              name: 'Default',
              paths: {
                ignored: [],
                white_list: [],
                black_list: []
              },
              extended_paths: {
                ignored: [],
                white_list: [],
                black_list: []
              },
              use_extended_paths: true
            }
          }
        },
        slug: options.accessSlug,
        use_keyless: !options.authMode,
        use_standard_auth: options.authMode,
        active: options.active
      }
    }
    try {
      // POST to create
      const { Meta } = await this.curl({
        method: 'POST',
        endpoint: '/apis',
        payload: apiDefinintion
      })
      // GET to retrieve api_id
      const apiDetails = await this.curl({
        method: 'GET',
        endpoint: `/apis/${Meta}`
      })
      options.meta = Meta
      options.apiId = apiDetails.api_definition.api_id
    } catch (error) {
      this.ctx.logger.error('tyk api create error: %j', error)
      this.ctx.throw(400, `service can not be created: ${error.data.Message}`)
    }

    try {
      return await this.ctx.model.Service.create(options)
    } catch (error) {
      this.ctx.throw(400, `service can not be created: ${error}`)
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
    if (query.authMode !== undefined) {
      filter.authMode = query.authMode
    }
    return await this.ctx.model.Service.findAll({ where: filter })
  }

  async findById (id) {
    const service = await this.ctx.model.Service.findOne({
      where: { id },
      include: [
        {
          model: this.ctx.model.Key,
          through: { attributes: [] },
          include: [
            { model: this.ctx.model.Application, as: 'application' },
            { model: this.ctx.model.Policy, through: { attributes: [] } }
          ]
        }
      ]
    })
    if (!service) {
      this.ctx.throw(400, `service not found by ${id}`)
    }

    // policies ctrls the service, could not apply to key
    const policies = await this.ctx.model.Policy.findAll({
      where: {
        accessRights: { [Op.contains]: [{ serviceId: service.id.toString() }] }
      }
    })

    const result = service.toJSON()
    result.accessUrl = `${this.config.gateway.apiUrl}/${result.accessSlug}`
    result.policies = policies
    return result
  }

  async update (values, id) {
    this.ctx.logger.info('service update payload: %j', values)
    const service = await this.ctx.model.Service.findOne({ where: { id } })
    if (!service) {
      this.ctx.throw(400, 'service not found')
    }
    if (service.deleted) { this.ctx.throw(400, 'service has been deleted already') }

    if (Object.prototype.hasOwnProperty.call(values, 'targetUrl')) {
      this.validateProtocols(values.targetUrl)
    }
    if (Object.prototype.hasOwnProperty.call(values, 'accessSlug')) {
      this.validateAccessSlug(values.accessSlug)
    }
    // TODO: this part need to be rewrite as a wrapper
    const apiDefinintion = {
      api_definition: {
        org_id: this.config.gateway.orgId,
        name: values.name || service.name,
        auth: {
          auth_header_name: 'Authorization'
        },
        definition: {
          location: 'header',
          key: ''
        },
        proxy: {
          target_url: values.targetUrl || service.targetUrl
        },
        version_data: {
          use_extended_paths: true,
          not_versioned: true,
          versions: {
            Default: {
              expires: '',
              name: 'Default',
              paths: {
                ignored: [],
                white_list: [],
                black_list: []
              },
              extended_paths: {
                ignored: [],
                white_list: [],
                black_list: []
              },
              use_extended_paths: true
            }
          }
        },
        slug: values.accessSlug || service.accessSlug,
        use_keyless: Object.prototype.hasOwnProperty.call(values, 'authMode')
          ? !values.authMode
          : !service.authMode,
        use_standard_auth: Object.prototype.hasOwnProperty.call(values, 'authMode')
          ? values.authMode
          : service.authMode,
        active: Object.prototype.hasOwnProperty.call(values, 'active')
          ? values.active
          : service.active
      }
    }

    try {
      await this.curl({
        method: 'PUT',
        endpoint: `/apis/${service.meta}`,
        payload: apiDefinintion
      })
    } catch (error) {
      this.ctx.logger.error('tyk api update error: %j', error)
      this.ctx.throw(400, `service can not be updated: ${error.data.Message}`)
    }

    try {
      return await service.update(values)
    } catch (error) {
      this.ctx.throw(400, `service can not be updated: ${error}`)
    }
  }

  async destroy (id) {
    const service = await this.ctx.model.Service.findOne({ where: { id } })
    if (!service) {
      this.ctx.throw(400, `service not found by ${id}`)
    }

    if (service.deleted) { this.ctx.throw(400, 'service has been deleted already') }

    // check related keys, if not all deleted, can not delete service.
    const keys = await service.getKeys()
    if (keys.some(k => k.deleted === false)) {
      this.ctx.throw(
        400,
        'keys are associate with this service, can not delete the service'
      )
    }

    try {
      try {
        await this.curl({
          method: 'DELETE',
          endpoint: `/apis/${service.meta}`
        })
      } catch (error) {
        this.ctx.logger.error('tyk api delete error: %j', error)
        this.ctx.throw(
          400,
          `service can not be deleted: ${error.data.Message}`
        )
      }

      return await service.update({ deleted: true })
    } catch (error) {
      this.ctx.throw(400, `service can not be deleted: ${error}`)
    }
  }
}

module.exports = ServiceService
