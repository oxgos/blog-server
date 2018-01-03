var express = require('express')
var router = express.Router()
var User = require('./../app/models/user')

// 登陆接口
router.post('/login', function(req, res, next) {
  var username = req.body.username,
      password = req.body.password
  User.findOne({'username': username}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    }
    if (user) {
      if (user.password === password) {
        req.session.user = user
        // console.log(req.session.id)
        res.json({
          status: '0',
          msg: '',
          result: 'login success'
        })
      } else {
        res.json({
          status: '1',
          msg: 'password incorrect',
          result: ''
        })
      }
    } else {
        res.json({
          status: '1',
          msg: 'user not exist',
          result: ''
      })
    }
  })
})

// 登出接口
router.get('/logout', (req, res, next) => {
  delete req.session.user
  res.json({
    status: '1',
    msg: '用户已登出',
    result: ''
  })
})

// 检测是否已经登陆
router.get('/checklogin', (req, res, next) => {
  if (req.session.user) {
    res.json({
      status: '1',
      msg: '用户已登陆',
      result: ''
    })
  } else {
    res.json({
      status: '0',
      msg: '用户未登陆',
      result: ''
    })
  }
})

module.exports = router
