const { createJWT, isTokenValid, attachCookiesToResponse } = require('./JWT')
const createTokenUser = require('./createTokenUser')
const checkPermissions = require('./checkPermissions')


module.exports = {

    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions

}