var express = require('express')
var router = express.Router()
var User = require('./../app/models/user')

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

module.exports = router
