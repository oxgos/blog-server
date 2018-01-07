var mongoose = require('mongoose')

var articleSchema = new mongoose.Schema({
    title: String,
    author: String,
    content: String,
    category: String,
    tag: Array,
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
})

module.exports = articleSchema