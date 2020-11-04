'use strict'

const UmsService = require('./ums')
const _ = require('lodash')

class CompanyService extends UmsService {
  async create (payload) {
    const req = {
      companyName: payload.name,
      industryType: payload.industryType,
      email: payload.emailDomain,
      website: payload.website,
      walletAddress: payload.wallets
        ? _.map(payload.wallets, wallet => {
          return {
            address: wallet.address,
            from: wallet.provider,
            name: payload.name,
            description: payload.description,
            seed: payload.seed,
            prvKey: payload.prvKey,
            pubKey: payload.pubKey,
            btype: payload.btype
          }
        })
        : undefined,
      externalSystems: payload.externalSystems,
      companyTypes: payload.types
    }
    if (payload.address) {
      const address = payload.address
      req.address = {
        telephone: address.telephone,
        street: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        zip: address.zip
      }
    }

    // consoleconnect feature
    req.externalSystems = this.buildConsoleConnectExternals(payload)

    const company = await this.curl({
      method: 'POST',
      endpoint: '/companies',
      payload: req
    })

    return this.render(company)
  }

  async findOne (id) {
    const { ctx } = this
    ctx.logger.info('find a company by %s', id)
    const company = await this.curl({
      method: 'GET',
      endpoint: `/companies/${id}`
    })

    return this.render(company)
  }

  async list ({
    deleted = false,
    walletAddress,
    name,
    filterEmptyWallet = false,
    consoleconnectEnabled,
    types
  }) {
    const { ctx } = this
    const querystring = require('querystring')

    const query = {
      deleted,
      filterEmptyWallet
    }

    if (walletAddress) {
      query.walletAddress = walletAddress
    }
    if (name) {
      query.companyName = name
    }
    const q = querystring.stringify(query)
    ctx.logger.info('q:%s', q)
    const companies = await this.curl({
      method: 'GET',
      endpoint: `/companies?${q}`
    })

    const result = _.filter(
      _.map(companies, company => this.render(company)),
      company => {
        if (
          filterEmptyWallet &&
          filterEmptyWallet === 'true' &&
          (!company.wallets || company.wallets.length <= 0)
        ) {
          return false
        }

        if (types && _.intersection(types, company.types).length === 0) {
          return false
        }

        if (
          consoleconnectEnabled &&
          consoleconnectEnabled === 'true' &&
          (!company.consoleconnect || company.consoleconnect.enabled === false)
        ) {
          return false
        }
        return true
      }
    )

    return result
  }

  async update (id, payload) {
    const { ctx } = this
    ctx.logger.info('update:%s,%j', id, payload)

    const company = await this.curl({
      method: 'PUT',
      endpoint: `/companies/${id}`,
      payload
    })

    return this.render(company)
  }

  async destroy (id) {
    const { ctx } = this
    ctx.logger.info('delete:%s', id)
    const company = await this.curl({
      method: 'DELETE',
      endpoint: `/companies/${id}`
    })

    return this.render(company)
  }

  buildConsoleConnectExternals (req) {
    const { config } = this
    const ccState = {
      name: 'CC',
      key: 'STATE',
      value: req.consoleconnectEnabled ? 'PROCESSING' : 'DISABLED'
    }

    let externals = req.externalSystems
    if (!externals) {
      externals = []
    }
    externals.push(ccState)

    // generate email only on consoleconnectEnabled == true
    if (req.consoleconnectEnabled) {
      const emails = config.service.consoleconnect.email.split('@')
      const ccEmail = {
        name: 'CC',
        key: 'USER_EMAIL',
        value: emails[0].concat('+', new Date().getTime(), '@', emails[1])
      }

      const ccPassword = {
        name: 'CC',
        key: 'USER_PASSWORD',
        value: ''
      }

      externals.push(ccEmail)
      externals.push(ccPassword)
    }
    return externals
  }

  render (company) {
    if (!company) {
      return {}
    }

    const externalSystems = company.externalSystems
    const consoleconnect = {
      enabled:
        externalSystems != null &&
        _.find(
          externalSystems,
          external =>
            external.name === 'CC' &&
            external.key === 'STATE' &&
            external.value === 'ENABLED'
        ) != null
    }

    if (consoleconnect.enabled) {
      consoleconnect.email = _.find(
        externalSystems,
        external => external.name === 'CC' && external.key === 'USER_EMAIL'
      ).value
      consoleconnect.password = _.find(
        externalSystems,
        external => external.name === 'CC' && external.key === 'USER_PASSWORD'
      ).value
    }

    return {
      id: company.id,
      name: company.name,
      industryType: company.industryType,
      website: company.website,
      wallets: _.map(company.walletAddress, wallet => {
        return {
          id: wallet.id,
          provider: wallet.from,
          address: wallet.address,
          name: wallet.name,
          description: wallet.description,
          seed: wallet.seed,
          prvKey: wallet.prvKey,
          pubKey: wallet.pubKey,
          btype: wallet.btype,
          createdAt: wallet.createdAt
        }
      }),
      externalSystems: company.externalSystems,
      emailDomain: company.email,
      avatar: company.avatar
        ? company.avatar
        : 'https://image.flaticon.com/icons/svg/1271/1271406.svg',
      types: company.types,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      deletedAt: company.deletedAt,
      deleted: company.deleted,
      address: company.address
        ? {
          telephone: company.address.telephone,
          address: company.address.street,
          city: company.address.city,
          state: company.address.state,
          country: company.address.country,
          zip: company.address.zip
        }
        : undefined,
      consoleconnect
    }
  }
}

module.exports = CompanyService
