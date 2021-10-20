const express = require('express')
const router = express.Router()

const { createProduct, getAllProducts, getProduct, updateProduct, deleteProduct, uploadImage, getProductReviews } = require('../Controllers/product')
const { authenticateUser, authorizePermissions } = require('../Middleware/authentication')


router
    .route('/')
    .post([authenticateUser, authorizePermissions('admin')], createProduct)
    .get(getAllProducts)

router
    .route('/uploadImage')
    .post([authenticateUser, authorizePermissions('admin')], uploadImage)

router
    .route('/:id')
    .get(getProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)

router
    .route('/:id/reviews')
    .get(getProductReviews)


module.exports = router