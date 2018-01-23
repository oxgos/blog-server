var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var multipartMiddleware = require('connect-multiparty')()
var { uploadImage } = require('./../middleware/uploadImage.js')
var { handleError } = require('./../public/util/handleError.js')
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
		password = req.body.password
	User.findOne({'account': account}, (err, doc) => {
		if (err) {
			res.json({
				status: '0',
				msg: err.message,
				result: ''
			})
		}
		if (!doc) {
			let newInfo = {
				avatar: '',
				job: '',
				address: '',
				tel: '',
				email: ''
			}
			let info = new Info(newInfo)
			console.log(info)
			info.save((err) => {
				if (err) {
					res.json({
						status: '0',
						msg: err.message,
						result: ''
					})
				} else {
					let newUser = {
						account: account,
						password: password,
						info: info._id
					}
					let user = new User(newUser)
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
	User.findOne({'account': account})
		.populate('info', 'username avatar')
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

// 读取用户资料
router.get('/getUserInfo', (req, res, next) => {
	let infoId = req.query.infoId
	Info.findOne({ _id: infoId }, (err, info) => {
		if (err) {
			handleError(err)
		}
		if (info) {
			res.json({
				status: '1',
				msg: '',
				result: info
			})
		}
	})
})

// 上传用户资料
router.post('/updateInfo', multipartMiddleware, uploadImage, (req, res, next) => {
	let infoId = req.body.infoId
	let username = req.body.username
	let job = req.body.job
	let address = req.body.address
	let tel = req.body.tel
	let email = req.body.email
	let avatarUrl = ''
	if (req.avatarUrl) {
		avatarUrl = req.avatarUrl
	}
	Info.findOne({ _id: infoId }, (err, info) => {
		if (err) {
			handleError(err)
		}
		if (info) {
			if (info.avatar !== '' && (avatarUrl !== '')) {
				let oldPath = path.join(__dirname, '../', `/public/${info.avatar}`)
				fs.unlink(oldPath, (err) => {
					if (err) {
						if (err.code === 'ENOENT') {
							console.error('myfile does not exist')
						}
						handleError(err)
					}
				})
			}
			info.username = username
			info.job = job
			info.address = address
			info.tel = tel
			info.email = email
			avatarUrl && (info.avatar = avatarUrl)
			info.save(err => {
				if (err) {
					handleError(err)
				} else {
					res.json({
						status: '1',
						msg: '用户资料保存成功',
						result: ''
					})
				}
			})
		}
	})
})

module.exports = router