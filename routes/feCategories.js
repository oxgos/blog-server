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
    let path = req.query.path
    Category
        .findOne({ path: path })
        .populate('articles')
        .exec()
        .then(category => {
            if (category) {
                res.json({
                    status: '1',
                    msg: '',
                    result: {
                        name: category.name,
                        articles: category.articles
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