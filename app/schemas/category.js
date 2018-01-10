var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 获取ObjectId,populate需用到，用于表与表的关联
var ObjectId = Schema.Types.ObjectId

var categorySchema = new Schema({
    name: String,
    articles: [{
        type: ObjectId,
        ref: 'Article'
    }],
    visible: {
        type: Boolean,
        default: true
    },
    meta: {
        createdAt: {
            type: Date,
            defalut: Date.now()
        },
        updatedAt: {
            type: Date,
            defalut: Date.now()
        }
    }
})

categorySchema.pre('save', function() {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

module.exports = categorySchema