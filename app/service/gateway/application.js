'use strict'

const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class ApplicationService extends Service {
  async create (application) {
    this.ctx.logger.info('application create payload: %j', application)
    try {
      return await this.ctx.model.Application.create(application)
    } catch (error) {
      this.ctx.throw(
        400,
        `application can not be created: ${error.errors[0].message}`
      )
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
    return await this.ctx.model.Application.findAll({ where: filter })
  }

  async findByName (name) {
    const application = await this.ctx.model.Application.findOne({
      where: { name }
    })
    if (!application) {
      this.ctx.throw(400, 'application not found')
    }
    return application
  }

  async findByOwner (owner) {
    const application = await this.ctx.model.Application.find({
      where: { owner }
    })
    if (!application) {
      this.ctx.throw(400, 'application not found')
    }
    return application
  }

  async findById (id) {
    const application = await this.ctx.model.Application.findOne({
      where: { id },
      include: [
        {
          model: this.ctx.model.Key,
          as: 'keys',
          include: [
            {
              model: this.ctx.model.Service,
              // show active service
              // where: { active: true },
              // Hide unwanted `servicekeys` nested object from results
              through: { attributes: [] }
            },
            { model: this.ctx.model.Policy, through: { attributes: [] } }
          ]
        }
      ]
    })
    if (!application) {
      this.ctx.throw(400, `application not found by ${id}`)
    }
    return application
  }

  async update (values, id) {
    this.ctx.logger.info('application update payload: %j', values)
    const application = await this.ctx.model.Application.findOne({
      where: { id }
    })
    if (application.deleted) {
      this.ctx.throw(400, 'application has been deleted already')
    }
    try {
      return await application.update(values)
    } catch (error) {
      this.ctx.throw(
        400,
        `application can not be updated: ${error.errors[0].message}`
      )
    }
  }

  async destroy (id) {
    this.ctx.logger.info(`application deletion ${id}`)
    const application = await this.ctx.model.Application.findOne({
      where: { id }
    })
    if (!application) {
      this.ctx.throw(400, `application not found by ${id}`)
    }

    if (application.deleted) {
      this.ctx.throw(400, 'application has been deleted already')
    }

    const keys = await application.getKeys()

    if (keys.some(k => k.deleted === false)) {
      this.ctx.throw(
        400,
        'keys are associate with this application, can not delete the application'
      )
    }

    try {
      return await application.update({ deleted: true })
    } catch (error) {
      this.ctx.throw(
        400,
        `application can not be deleted: ${error.errors[0].message}`
      )
    }
  }
}

module.exports = ApplicationService
