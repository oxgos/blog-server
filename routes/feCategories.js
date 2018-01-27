var express = require('express')
var router = express.Router()
var Category = require('./../app/models/category')

// 分类列表
router.get('/', (req, res, next) => {
    Category.find({}, (err, doc) => {
        if (err) {
            res.json(handleError(err))
        }
        if (doc) {
            res.json({
                status: '1',
                msg: '',
                result: doc
            })
        }
    })
})

// 前台请求文章数据
router.get('/articleList', (req, res, next) => {
    // 储存截取后文章
    let articles = []
    // 总文章数
    let total
    // 总页数
    let page
    // 每页数量
    let count = 5
    // 判断所属分类
    let path = req.query.path
    // 页数
    let index = req.query.index
    Category
        .findOne({ path: path })
        .populate('articles')
        .exec()
        .then(category => {
            if (category) {
                articles = category.articles.slice(count * index, count * index + count)
                total = category.articles.length
                page = Math.ceil(total / count)
                res.json({
                    status: '1',
                    msg: '',
                    result: {
                        name: category.name,
                        articles: articles,
                        total: total,
                        page: page
                    }
                })
            } else {
                res.json({
                    status: '0',
                    msg: '分类不存在',
                    result: ''
                })
            }
        })
})

module.exports = router