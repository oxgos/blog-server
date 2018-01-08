var express = require('express')
var router = express.Router()
var Article = require('./../app/models/article')

// 发表新文章
router.post('/articleNew', (req, res, next) => {
    var art = {}
    art.type = req.body.type,
    art.title = req.body.title,
    art.content = req.body.content,
    art.category = req.body.category
    Article.findOne({ title: art.title }, (err, doc) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }
        if (!doc) {
            var newArticle = new Article(art)
            newArticle.save((err1) => {
                if (err1) {
                    res.json({
                        status: '0',
                        msg: err1.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '发表文章成功',
                        result: ''
                    })
                }
            })
        }
    })
})

// 文章列表
router.get('/', (req, res, next) => {
    Article.find({}, (err, articles) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }
        if (articles) {
            res.json({
                status: '1',
                msg: '',
                result: articles
            })
        }
    })
})


module.exports = router