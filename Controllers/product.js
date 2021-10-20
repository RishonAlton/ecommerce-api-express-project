const { join } = require('path')
const { StatusCodes } = require('http-status-codes')
const Product = require('../Models/Product')
const Review = require('../Models/Review')
const { NotFoundError, BadRequestError } = require('../Errors')


const createProduct = async (req, res) => {

    req.body.user = req.user.userID
    const product = await Product.create(req.body)

    res.status(StatusCodes.CREATED).json({ product })

}


const getAllProducts = async (req, res) => {

    const products = await Product.find({})

    res.status(StatusCodes.OK).json({ products, count: products.length })

}


const getProduct = async (req, res) => {

    const { id: productID } = req.params
    const product = await Product.findOne({ _id: productID }).populate('reviews')

    if (!product) {
        throw new NotFoundError(`No product with the ID of ${productID}`)
    }

    res.status(StatusCodes.OK).json({ product })

}


const updateProduct = async (req, res) => {

    const { id: productID } = req.params
    const product = await Product.findOneAndUpdate({ _id: productID }, req.body, { new: true, runValidators: true })

    if (!product) {
        throw new NotFoundError(`No product with the ID of ${productID}`)
    }

    res.status(StatusCodes.OK).json({ product })

}


const deleteProduct = async (req, res) => {

    const { id: productID } = req.params
    const product = await Product.findOne({ _id: productID })

    if (!product) {
        throw new NotFoundError(`No product with the ID of ${productID}`)
    }

    await product.remove()

    res.status(StatusCodes.OK).json({ message: 'Product deleted successfully!' })

}


const uploadImage = async (req, res) => {

    if (!req.files) {
        throw new BadRequestError('No file uploaded')
    }

    const productImage = req.files.image

    if (!productImage.mimetype.startsWith('image')) {
        throw new BadRequestError('Please upload an image')
    }

    if (productImage.size > (1024 * 1024)) {
        throw new BadRequestError('Please upload an image smaller than 1 MB')
    }

    const imagePath = join(__dirname, '../Public/Uploads/' + productImage.name)
    await productImage.mv(imagePath)

    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })

}


const getProductReviews = async (req, res) => {

    const { id: productID } = req.params
    const reviews = await Review.find({ product: productID })

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length })

}


module.exports = {

    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    getProductReviews

}