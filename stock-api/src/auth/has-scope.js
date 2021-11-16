
const hasScope = function (scope) {
  return (req, res, next) => {
    console.log('req.user: ', req.user)
    const { scope:scopes } = req.user
    if(scopes && scopes.indexOf(permit) !== -1) return next()
    return next( new Error( 'scope is missing.' ) )
  }
}

module.exports = {
  hasScope
}