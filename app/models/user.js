var mongoose = require('mongoose')
var UserSchema = require('./../schemas/user')

var User = mongoose.model('users', UserSchema)

module.exports = User