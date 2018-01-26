var express = require('express')
var router = express.Router()
var Article = require('./../app/models/article')
var { handleError } = require('./../public/util/handleError')

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

// 文章详情
router.get('/detail', (req, res, next) => {
    let id = req.query.id
    Article.findOne({ _id: id }, (err, article) => {
        if (err) {
            handleError(err)
        }
        if (article) {
            res.json({
                status: '1',
                msg: '',
                result: article
            })
        } else {
            res.json({
                status: '0',
                msg: '文章不存在',
                result: ''
            })
        }
    })
})

module.exports = router
