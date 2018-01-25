var express = require('express')
var router = express.Router()
var Article = require('./../app/models/article')

// 文章列表
router.get('/', (req, res, next) => {
    Article
        .find({})
        .populate('category', 'name')
        .exec()
        .then(article => {
            res.json({
                status: '1',
                msg: '',
                result: article
            })
        })
})

module.exports = router
