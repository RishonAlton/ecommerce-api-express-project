const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide Product name'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters']
    },

    price: {
        type: Number,
        required: [true, 'Please provide Product price'],
    },

    description: {
        type: String,
        required: [true, 'Please provide Product description'],
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },

    image: {
        type: String,
        required: [true, 'Please provide Product image'],
    },

    category: {
        type: String,
        required: [true, 'Please provide Product category'],
        enum: {
            values: ['Office', 'Living Room', 'Kitchen', 'Bedroom', 'Dining', 'Kids'],
            message: `'{VALUE}' is not supported`
        }
    },

    company: {
        type: String,
        required: [true, 'Please provide Product company'],
        enum: {
            values: ['Ikea', 'Liddy', 'Marcos', 'Caressa'],
            message: `'{VALUE}' is not supported`
        }
    },

    colors: {
        type: [String],
        default: ['#222'],
    },

    featured: {
        type: Boolean,
        default: false
    },

    freeShipping: {
        type: Boolean,
        default: false
    },

    inventory: {
        type: Number,
        required: [true, 'Please provide Product Inventory value'],
        default: 0
    },

    numberOfReviews: {
        type: Number,
        default: 0
    },

    averageRating: {
        type: Number, 
        default: 0
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true,  toJSON: {virtuals: true}, toObject: {virtuals: true}})


ProductSchema.virtual('reviews', {

    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false

})


ProductSchema.pre('remove', async function () {

    await this.model('Review').deleteMany({ product: this._id })

})


module.exports = mongoose.model('Product', ProductSchema)