var mongoose = require('mongoose')
var articleSchema = require('./../schemas/article')

var Article = mongoose.model('articles', articleSchema)

module.exports = Article