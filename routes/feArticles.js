var express = require('express')
var router = express.Router()
var Article = require('./../app/models/article')
var { handleError } = require('./../public/util/handleError')

// 文章列表
router.get('/', (req, res, next) => {
    // 总文章数
    let total
    // 页数
    let index = req.query.index
    // 每页数量
    let count = 4
    Article.find({}, (err, articles) => {
        if (err) {
            handleError(err)
        }
        total = articles.length
    })
    // 总页数
    let page = Math.ceil(total / count)
    Article
        .find({})
        .populate('category', 'name')
        .skip(count * page)
        .limit(count)
        .exec()
        .then(articles => {
            res.json({
                status: '1',
                msg: '',
                result: {
                    articles: articles,
                    total: total,
                    page: page
                }
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
