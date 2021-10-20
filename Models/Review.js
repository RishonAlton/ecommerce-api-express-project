const mongoose = require('mongoose')


const ReviewSchema = new mongoose.Schema({

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide a rating']
    },

    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide the review title'],
        maxLength: 100
    },

    comment: {
        type: String,
        required: [true, 'Please provide the review text'],
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }

}, { timestamps: true })


ReviewSchema.index({ product: 1, user: 1 }, { unique: true })


ReviewSchema.statics.calculateAverageRating = async function (productID) {

    const result = await this.aggregate([
        {
            $match: { product: productID }
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numberOfReviews: { $sum: 1 }
            }
        }
    ])

    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productID }, 
            { 
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numberOfReviews: result[0]?.numberOfReviews || 0
            }
        )
    } 
    catch (error) {
        console.log(error)
    }

}


ReviewSchema.post('save', async function () {

    await this.constructor.calculateAverageRating(this.product)

})


ReviewSchema.post('remove', async function () {

    await this.constructor.calculateAverageRating(this.product)

})


module.exports = mongoose.model('Review', ReviewSchema)