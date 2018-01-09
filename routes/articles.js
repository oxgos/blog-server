var express = require('express')
var router = express.Router()
var Article = require('./../app/models/article')

// 发表新文章
router.post('/articleNew', (req, res, next) => {
    var art = {}
    art.type = req.body.type,
    art.title = req.body.title,
    art.htmlContent = req.body.htmlContent,
    art.mdContent = req.body.mdContent,
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

// 文章详情
router.get('/detail', (req, res, next) => {
    let id = req.query.id
    Article.findOne({ _id: id }, (err, article) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }
        if (article) {
            res.json({
                status: '1',
                msg: '',
                result: article
            })
        }
    })
})

// 删除文章
router.delete('/delete', (req, res, next) => {
    let id = req.query.id
    Article.findOne({ _id: id }, (err, article) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }
        if (article) {
            article.remove(err1 => {
                if (err1) {
                    res.json({
                        status: '0',
                        msg: err1.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '删除成功',
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