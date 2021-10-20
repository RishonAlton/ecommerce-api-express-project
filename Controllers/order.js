const { StatusCodes } = require('http-status-codes')
const Order = require('../Models/Order')
const Product = require('../Models/Product')
const { BadRequestError, NotFoundError } = require('../Errors')
const { checkPermissions } = require('../Utils')


const processPayment = async ({ amount, currency }) => {

    const client_secret = '616ac07fef23e4775b13b356fg23565gfaxgj33242se2h346th57j2t'

    return { client_secret, amount, currency }

}


const createOrder = async (req, res) => {

    const { items: cartItems, tax, shippingFee } = req.body

    if (!cartItems || cartItems.length < 1) {
        throw new BadRequestError('No cart items provided')
    }

    if (!tax || !shippingFee) {
        throw new BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
        const product = await Product.findOne({ _id: item.product })
        if (!product) {
            throw new NotFoundError(`No product with the ID of ${item.product}`)
        }
        const { name, price, image, _id: productID } = product
        const orderItem = {
            product: productID,
            name,
            price,
            image,
            quantity: item.quantity
        }
        orderItems = [...orderItems, orderItem]
        subtotal += price * item.quantity
    }

    const total = tax + shippingFee + subtotal

    const paymentIntent = await processPayment({
        amount: total,
        currency: 'usd'
    })

    const order = await Order.create({
        orderItems,
        subtotal,
        shippingFee,
        tax,
        total,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userID
    })

    res.status(StatusCodes.CREATED).json({ order })

}


const getAllOrders = async (req, res) => {

    const orders = await Order.find({})

    res.status(StatusCodes.OK).json({ orders, count: orders.length })

}


const getCurrentUserOrders = async (req, res) => {

    const orders = await Order.find({ user: req.user.userID })

    res.status(StatusCodes.OK).json({ orders, count: orders.length })

}


const getOrder = async (req, res) => {

    const { id: orderID } = req.params
    const order = await Order.findOne({ _id: orderID })

    if (!order) {
        throw new NotFoundError(`No order with the ID of ${orderID}`)
    }

    checkPermissions(req.user, order.user)

    res.status(StatusCodes.OK).json({ order })

}


const updateOrder = async (req, res) => {

    const { id: orderID } = req.params 
    const { paymentIntentID } = req.body

    const order = await Order.findOne({ _id: orderID })

    if (!order) {
        throw new NotFoundError(`No order with the ID of ${orderID}`)
    }

    checkPermissions(req.user, order.user)

    order.paymentIntentID = paymentIntentID
    order.status = 'paid'

    await order.save()

    res.status(StatusCodes.OK).json({ order })

}


module.exports = {

    createOrder,
    getAllOrders,
    getCurrentUserOrders,
    getOrder,
    updateOrder

}