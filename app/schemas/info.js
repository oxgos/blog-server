const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const InfoSchema = new Schema({
    username: {
        type: String,
        default: '临时用户名'
    },
    avatar: String,
    job: String,
    address: String,
    tel: String,
    email: String,
    meta: {
        craetedAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

InfoSchema.pre('save', function () {
    if (this.isNew) {
        this.meta.craetedAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
})

module.exports = InfoSchema