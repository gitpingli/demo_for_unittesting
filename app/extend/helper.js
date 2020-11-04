'use strict'

const startUpAt = new Date().toJSON()

module.exports = {
  getStartUpAt () {
    return startUpAt
  },
  getAccessToken () {
    const { ctx } = this
    const bearerToken = ctx.request.header.authorization
    return bearerToken && bearerToken.replace('Bearer ', '')
  },

  async decodeToken () {
    const { ctx } = this

    const token = this.getAccessToken(ctx)
    const verifyResult = await this.verifyToken(token)
    if (!verifyResult.verify) {
      ctx.throw(401, verifyResult.error)
    }

    return verifyResult.payload
  },

  createToken (payload) {
    const { app } = this
    return app.jwt.sign(payload, app.config.jwt.secret, {
      expiresIn: '12h'
    })
  },

  async verifyToken (token) {
    const { app } = this

    return new Promise(resolve => {
      app.jwt.verify(token, app.config.jwt.secret, function (err, decoded) {
        const result = {}
        if (err) {
          result.verify = false
          result.error = err
        } else {
          result.verify = true
          result.payload = decoded
        }
        resolve(result)
      })
    })
  },

  toInt (str) {
    if (typeof str === 'number') return str
    if (!str) return str
    return parseInt(str, 10) || 0
  }
}
