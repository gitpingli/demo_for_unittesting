'use strict'

module.exports = () => {
  return async function errorHandler (ctx, next) {
    try {
      await next()
    } catch (err) {
      // ctx.app.emit('error', err, ctx);
      ctx.logger.error('error:%j', err)

      const statusCode = parseInt(err.status || err.statusCode || err.code || 500)
      const errorCode = parseInt(err.sub_code || 0)
      const error = err.error || err.message

      ctx.body = { statusCode, errorCode, error }
      ctx.status = statusCode
    }
  }
}
