'use strict'

const UmsService = require('./user')

class WalletService extends UmsService {
  async create (companyId, payload) {
    const req = {
      from: payload.provider ? 'QLC' : payload.provider,
      address: payload.address,
      name: payload.name,
      description: payload.description,
      seed: payload.seed,
      prvKey: payload.prvKey,
      pubKey: payload.pubKey,
      btype: payload.btype
    }
    const endpoint = `/companies/${companyId}/wallets`

    const wallet = await this.curl({
      method: 'POST',
      endpoint,
      payload: req
    })

    return wallet
  }

  async findOne (companyId, id) {
    const endpoint = `/companies/${companyId}/wallets/${id}`
    const wallet = await this.curl({
      method: 'GET',
      endpoint
    })

    return wallet
  }

  async list (companyId) {
    const endpoint = `/companies/${companyId}/wallets`
    const wallets = await this.curl({
      method: 'GET',
      endpoint
    })

    return wallets
  }

  async update (companyId, id, payload) {
    const endpoint = `/companies/${companyId}/wallets/${id}`
    const wallet = await this.curl({
      method: 'PUT',
      endpoint,
      payload
    })

    return wallet
  }

  async destroy (companyId, id) {
    const endpoint = `/companies/${companyId}/wallets/${id}`
    const wallet = await this.curl({
      method: 'DELETE',
      endpoint
    })

    return wallet
  }
}

module.exports = WalletService
