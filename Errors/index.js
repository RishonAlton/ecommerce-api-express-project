const CustomAPIError = require('./custom-api')
const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const ForbiddenError = require('./forbidden')


module.exports = {

    CustomAPIError,
    NotFoundError,
    BadRequestError,
    UnauthenticatedError,
    ForbiddenError

}