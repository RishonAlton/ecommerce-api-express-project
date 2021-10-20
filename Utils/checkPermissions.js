const { ForbiddenError } = require('../Errors')


const checkPermissions = (requestUser, resourceUserID) => {

    if (requestUser.role === 'admin') return
    if (requestUser.userID === resourceUserID.toString()) return

    throw new ForbiddenError('Unauthorized to access this Route!')

}


module.exports = checkPermissions