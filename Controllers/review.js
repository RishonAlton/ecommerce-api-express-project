const { StatusCodes } = require('http-status-codes')
const Review = require('../Models/Review')
const Product = require('../Models/Product')
const { NotFoundError, BadRequestError } = require('../Errors')
const { checkPermissions } = require('../Utils')


const createReview = async (req, res) => {

    const { product: productID } = req.body
    const { userID } = req.user

    const product = await Product.findOne({ _id: productID })
    if (!product) {
        throw new NotFoundError(`No product with the ID of ${productID}`)
    }

    const alreadySubmitted = await Review.findOne({ user: userID, product: productID })
    if (alreadySubmitted) {
        throw new BadRequestError('Already submitted review for this product')
    }

    req.body.user = userID

    const review = await Review.create(req.body)

    res.status(StatusCodes.CREATED).json({ review })

}


const getAllReviews = async (req, res) => {

    const reviews = await Review.find({}).populate({ path: 'product', select: 'name company price' }).populate({ path: 'user', select: 'name' })

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })

}


const getReview = async (req, res) => {

    const { id: reviewID } = req.params

    const review = await Review.findOne({ _id: reviewID }).populate({ path: 'product', select: 'name company price' }).populate({ path: 'user', select: 'name' })

    if (!review) {
        throw new NotFoundError(`No review with the ID of ${reviewID}`)
    }

    res.status(StatusCodes.OK).json({ review })

}


const updateReview = async (req, res) => {

    const { id: reviewID } = req.params
    const { rating, title, comment } = req.body

    const review = await Review.findOne({ _id: reviewID })

    if (!review) {
        throw new NotFoundError(`No review with the ID of ${reviewID}`)
    }

    checkPermissions(req.user, review.user)

    if (rating) {
        review.rating = rating
    }
    if (title) {
        review.title = title
    }
    if (comment) {
        review.comment = comment
    }

    await review.save()

    res.status(StatusCodes.OK).json({ review })

}


const deleteReview = async (req, res) => {

    const { id: reviewID } = req.params

    const review = await Review.findOne({ _id: reviewID })

    if (!review) {
        throw new NotFoundError(`No review with the ID of ${reviewID}`)
    }

    checkPermissions(req.user, review.user)

    await review.remove()

    res.status(StatusCodes.OK).json({ message: 'Review deleted successfully' })

}


module.exports = {

    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview

}