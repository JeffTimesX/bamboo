
const hasPermission = function (permit) {
  return (req, res, next) => {
    console.log('req.user: ', req.user)
    const { permissions } = req.user
    if(permissions && permissions.indexOf(permit) !== -1) return next()
    return next( new Error( 'Permission is missing.' ) )
  }
}

module.exports = {
  hasPermission
}