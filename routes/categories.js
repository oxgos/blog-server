var express = require('express')
var router = express.Router()
var Category = require('./../app/models/category')

// 分类列表
router.get('/', (req, res, next) => {
    Category.find({}, (err, doc) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
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

// 新建分类
router.post('/new', (req, res, next) => {
    var obj = {}
    obj.name = req.body.name
    Category.findOne({ name: obj.name }, (err, doc) => {
        if (err) {
            res.json({
                status: '0',
                msg: err.message,
                result: ''
            })
        }
        if (!doc) {
            var category = new Category(obj)
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
                        msg: '创建分类成功',
                        result: ''
                    })
                }
            })
        }
    })
})

module.exports = router