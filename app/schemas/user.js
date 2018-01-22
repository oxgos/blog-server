const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new mongoose.Schema({
    account: {
        unique: true,
        type: String
    },
    // username: String,
    password: String,
    info: {
        type: ObjectId,
        ref: 'Info'
    },
    role: {
        type: Number,
        default: 0
    },
    /* 
        0: normal 普通用户
        1: verify 邮件激活后的用户
        2: professonal 高级用户

        >10: admin 管理员
        >50: super admin 超级管理员(开发时候用)
    */
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

module.exports = UserSchema