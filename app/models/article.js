var mongoose = require('mongoose')
var articleSchema = require('./../schemas/article')

var Article = mongoose.model('Article', articleSchema)

module.exports = Article