const express = require('express')
const router = express.Router()

const { createOrder, getAllOrders, getCurrentUserOrders, getOrder, updateOrder } = require('../Controllers/order')
const { authenticateUser, authorizePermissions } = require('../Middleware/authentication')


router
    .route('/')
    .post(authenticateUser, createOrder)
    .get(authenticateUser, getCurrentUserOrders)

router
    .route('/all')
    .get(authenticateUser, authorizePermissions('admin'), getAllOrders)

router
    .route('/:id')
    .get(authenticateUser, getOrder)
    .patch(authenticateUser, updateOrder)


module.exports = router