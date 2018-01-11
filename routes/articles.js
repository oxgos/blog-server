var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Article = require('./../app/models/article')
var Category = require('./../app/models/category')

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

// 发表新文章
router.post('/articleNew', (req, res, next) => {
    var art = {}
    art.type = req.body.type,
    art.title = req.body.title,
    art.htmlContent = req.body.htmlContent,
    art.mdContent = req.body.mdContent,
    art.category = req.body.categoryId
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
            newArticle.save((err, article) => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    Category.findOne({ _id: article.category }, (err, category) => {
                        if (err) {
                            res.json({
                                status: '0',
                                msg: err.message,
                                result: ''
                            })
                        } else {
                            if (category) {
                                category.articles.push(article._id)
                                category.save(err => {
                                    if (err) {
                                        res.json({
                                            status: '0',
                                            msg: err.message,
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
                        }
                    })
                }
            })
        }
    })
})

// 编辑文章
router.post('/edit', (req, res, next) => {
    var id = req.body.id,
        type = req.body.type,
        title = req.body.title,
        htmlContent = req.body.htmlContent,
        mdContent = req.body.mdContent,
        category = req.body.category
    Article.findOne({ _id: id }, (err, article) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }
        if (article) {
            article.type = type
            article.title = title
            article.htmlContent = htmlContent
            article.mdContent = mdContent
            article.category = category
            article.save(err1 => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '修改文章成功',
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
    Article
        .findOne({ _id: id })
        .populate('category', '_id')
        .exec()
        .then(article => {
            Category.find({}, (err, categories) => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '',
                        result: {
                            'article': article,
                         'categories':categories
                        }
                    })
                }
            }) 
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
            Category.findOne({ _id: article.category.toString() }, (err, category) => {
                if (err) {
                    res.json({
                        status: '0',
                        msg: err.message,
                        result: ''
                    })
                }
                if (category) {
                    for (let i = 0; i < category.articles.length; i++) {
                        if (category.articles[i].toString() === article._id.toString()) {
                            category.articles.splice(i, 1)
                        }
                    }
                    category.save(err => {
                        if (err) {
                            res.json({
                                status: '0',
                                msg: err.message,
                                result: ''
                            })
                        } else {
                            article.remove(err => {
                                if (err) {
                                    res.json({
                                        status: '0',
                                        msg: err.message,
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
                }
            })
        }
    })
})

module.exports = router