'use strict'

module.exports = options => {
  return async function testAuth (ctx, next) {
    const whiteUrls = options.ignores || []
    const authUrls = options.authUrls || []
    const isWhiteUrl = whiteUrls.some(url => ctx.url.startsWith(url))
    const isAuthRequired = authUrls.some(url => ctx.url.startsWith(url))

    if (!isWhiteUrl && isAuthRequired) {
      ctx.logger.info('check auth')
      const user = await ctx.service.ums.agent.getLoggedInUser()
      if (!user) {
        ctx.throw(401, 'Unauthorized to access this resource by an anonymous user.')
      }
      ctx.user = user
      await next()
    } else {
      // ctx.logger.info('white url');
      await next()
    }
  }
}
