'use strict'

const Service = require('egg').Service
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class SinglespaService extends Service {
  async create (Singlespa) {
    this.ctx.logger.info('Singlespa create payload: %j', Singlespa)
    console.log(Singlespa)
    try {
      return await this.ctx.model.Singlespa.create(Singlespa)
    } catch (error) {
      console.log(error)
      this.ctx.throw(
        400,
        `Singlespa can not be created: ${error.errors[0].message}`
      )
    }
  }

  async list (query) {
    // trim undefined
    const filter = {}
    if (query.deleted !== undefined) {
      filter.deleted = query.deleted
    }
    if (query.active !== undefined) {
      filter.active = query.active
    }
    if (query.name !== undefined) {
      filter.name = { [Op.like]: `%${query.name}%` }
    }
    return await this.ctx.model.Singlespa.findAll({ where: filter })
  }

  async findByName (name) {
    const Singlespa = await this.ctx.model.Singlespa.findOne({
      where: { name }
    })
    if (!Singlespa) {
      this.ctx.throw(400, 'Singlespa not found')
    }
    return Singlespa
  }

  async findById (id) {
    const Singlespa = await this.ctx.model.Singlespa.findOne({
      where: { id }
    })
    if (!Singlespa) {
      this.ctx.throw(400, `Singlespa not found by ${id}`)
    }
    return Singlespa
  }

  async update (values, id) {
    this.ctx.logger.info('Singlespa update payload: %j', values)
    const Singlespa = await this.ctx.model.Singlespa.findOne({
      where: { id }
    })
    if (Singlespa.deleted) {
      this.ctx.throw(400, 'Singlespa has been deleted already')
    }
    try {
      return await Singlespa.update(values)
    } catch (error) {
      this.ctx.throw(
        400,
        `Singlespa can not be updated: ${error.errors[0].message}`
      )
    }
  }

  async destroy (id) {
    this.ctx.logger.info(`Singlespa deletion ${id}`)
    const Singlespa = await this.ctx.model.Singlespa.findOne({
      where: { id }
    })
    if (!Singlespa) {
      this.ctx.throw(400, `Singlespa not found by ${id}`)
    }

    if (Singlespa.deleted) {
      this.ctx.throw(400, 'Singlespa has been deleted already')
    }

    try {
      return await Singlespa.update({ deleted: true })
    } catch (error) {
      this.ctx.throw(
        400,
        'Singlespa can not be deleted'
      )
    }
  }
}

module.exports = SinglespaService
