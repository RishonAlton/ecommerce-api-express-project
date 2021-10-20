const express = require('express')
const router = express.Router()

const { getAllUsers, getUser, showCurrentUser, updateUser, updateUserPassword } = require('../Controllers/user')
const { authenticateUser, authorizePermissions } = require('../Middleware/authentication')


router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers)
router.get('/showMe', authenticateUser, showCurrentUser)
router.get('/:id', authenticateUser, authorizePermissions('admin'), getUser)
router.patch('/updateUser', authenticateUser, updateUser)
router.patch('/updateUserPassword', authenticateUser, updateUserPassword)


module.exports = router