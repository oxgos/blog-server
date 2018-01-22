var express = require('express')
var router = express.Router()
var multipartMiddleware = require('connect-multiparty')()
var {
	uploadImage
} = require('./../middleware/uploadImage.js')
var User = require('./../app/models/user')
var Info = require('./../app/models/info')

// 加载所有用户信息
router.get('/', (req, res, next) => {
	User.find({})
		.populate('info', 'username')
		.exec()
		.then((users) => {
			if (users) {
				res.json({
					status: '1',
					msg: '',
					result: users
				})
			}
		})
})

// 添加用户
router.post('/newAccount', (req, res, next) => {
	var account = req.body.account,
		// username = req.body.username,
		password = req.body.password
	User.findOne({
		'account': account
	}, (err, doc) => {
		if (err) {
			res.json({
				status: '0',
				msg: err.message,
				result: ''
			})
		}
		if (!doc) {
			let newUser = {
				account: account,
				// username: username,
				password: password
			}
			let user = new User(newUser)
			let newInfo = {
				account: user._id,
				avatar: '',
				job: '',
				tel: '',
				email: ''
			}
			let info = new Info(newInfo)
			info.save((err) => {
				if (err) {
					res.json({
						status: '0',
						msg: err.message,
						result: ''
					})
				} else {
					user.info = info._id
					user.save(err => {
						if (err) {
							res.json({
								status: '0',
								msg: err.message,
								result: ''
							})
						} else {
							res.json({
								status: '1',
								msg: '用户创建成功',
								result: ''
							})
						}
					})
				}
			})
		}
	})
})

// 删除用户
router.delete('/delUser', (req, res, next) => {
	let id = req.query.id
	User.findOne({
		_id: id
	}, (err, user) => {
		if (err) {
			res.json({
				status: '0',
				msg: err.message,
				result: ''
			})
		}
		if (user) {
			user.remove((err1) => {
				if (err1) {
					res.json({
						status: '0',
						msg: err1.message,
						result: ''
					})
				} else {
					res.json({
						status: '1',
						msg: '删除用户成功',
						result: ''
					})
				}
			})
		}
	})
})

// 修改用户权限
router.post('/modifyRole', (req, res, next) => {
	let role = req.body.role
	let id = req.body.id
	User.findOne({
		_id: id
	}, (err, user) => {
		if (err) {
			res.json({
				status: '0',
				msg: err.message,
				result: ''
			})
		}
		if (user) {
			if (user.role >= 50) {
				res.json({
					status: '0',
					msg: '权限不够，不能修改',
					result: ''
				})
			} else {
				user.role = role
				user.save(err1 => {
					if (err1) {
						res.json({
							status: '0',
							msg: err1.message,
							result: ''
						})
					} else {
						res.json({
							status: '1',
							msg: '权限修改成功',
							result: ''
						})
					}
				})
			}
		}
	})
})

// 最高权限修改密码
router.post('/adminPwd', (req, res, next) => {
	let pwd = req.body.password
	let id = req.body.id
	User.findOne({
		_id: id
	}, (err, user) => {
		if (err) {
			res.json({
				status: '0',
				msg: err.message,
				result: ''
			})
		}
		if (user) {
			user.password = pwd
			user.save(err1 => {
				if (err1) {
					res.json({
						status: '0',
						msg: err1.message,
						result: ''
					})
				} else {
					res.json({
						status: '1',
						msg: '修改密码成功',
						result: ''
					})
				}
			})
		}
	})
})

// 登陆接口
router.post('/login', (req, res, next) => {
	var account = req.body.account,
		password = req.body.password
	User.findOne({
			'account': account
		})
		.populate('info', 'username')
		.exec()
		.then((user) => {
			if (user) {
				if (user.password === password) {
					req.session.user = user
					res.json({
						status: '1',
						msg: '',
						result: {
							'user': user,
							'sessionId': req.session.id
						}
					})
				} else {
					res.json({
						status: '0',
						msg: 'password incorrect',
						result: ''
					})
				}
			} else {
				res.json({
					status: '0',
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
router.post('/checklogin', (req, res, next) => {
	let sessionId = req.body.sessionId
	if (req.session.id === sessionId) {
		res.json({
			status: '1',
			msg: '用户已登陆',
			result: req.session.user
		})
	} else {
		res.json({
			status: '0',
			msg: '用户未登陆',
			result: ''
		})
	}
})

// 上传头像
router.post('/uploadAvatar', multipartMiddleware, uploadImage, (req, res, next) => {
	let username = req.body.username
	let job = req.body.job
	let address = req.body.address
	let tel = req.body.tel
	let email = req.body.email
	let avatar = req.image
	console.log(req.image)
	res.json({
		status: '1'
	})
})

module.exports = router