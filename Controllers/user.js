const { StatusCodes } = require('http-status-codes')
const User = require('../Models/User')
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../Errors')
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../Utils')


const getAllUsers = async (req, res) => {

    const users = await User.find({ role: 'user' }).select('-password')

    res.status(StatusCodes.OK).json({ users })

}


const getUser = async (req, res) => {

    const user = await User.findOne({ _id: req.params.id }).select('-password')

    if (!user) {
        throw new NotFoundError(`No user with the ID of ${req.params.id}`)
    }

    checkPermissions(req.user, user._id)

    res.status(StatusCodes.OK).json({ user })

}


const showCurrentUser = async (req, res) => {

    res.status(StatusCodes.OK).json({ user: req.user })

}


const updateUser = async (req, res) => {

    const { name, email } = req.body

    if (!name || !email) {
        throw new BadRequestError('Please provide both the values')
    }

    const user = await User.findOneAndUpdate({ _id: req.user.userID }, { name, email }, { new: true, runValidators: true })

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })

    res.status(StatusCodes.OK).json({ user: tokenUser })

}


const updateUserPassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new BadRequestError('Please provide both the values')
    }

    const user = await User.findOne({ _id: req.user.userID })

    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Incorrect Password')
    }

    user.password = newPassword
    await user.save()

    res.status(StatusCodes.OK).json({ message: 'Password successfully updated' })

}


module.exports = {

    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword

}