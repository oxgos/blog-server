const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const articleSchema = new Schema({
    type: String,
    title: String,
    introduce: String,
    mdContent: String,
    htmlContent: String,
    poster: String,
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

articleSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

module.exports = articleSchema