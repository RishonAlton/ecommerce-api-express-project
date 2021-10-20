const { UnauthenticatedError, ForbiddenError } = require('../Errors')
const { isTokenValid } = require('../Utils')


const authenticateUser = (req, res, next) => {

    const token = req.signedCookies.token

    if (!token) {
        throw new UnauthenticatedError('Authentication Invalid!')
    }

    try {
        const { userID, name, role } = isTokenValid({ token })
        req.user = { userID, name, role }
        next()
    } 
    catch (error) {
        throw new UnauthenticatedError('Authentication Invalid!')
    }

}


const authorizePermissions = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError('Unauthorized to access this Route!')
        }
        next()
    }

}


module.exports = {

    authenticateUser,
    authorizePermissions

}