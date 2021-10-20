const express = require('express')
const router = express.Router()

const { authenticateUser } = require('../Middleware/authentication')
const { createReview, getAllReviews, getReview, updateReview, deleteReview } = require('../Controllers/review')


router
    .route('/')
    .post(authenticateUser, createReview)
    .get(getAllReviews)

router
    .route('/:id')
    .get(getReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview)


module.exports = router