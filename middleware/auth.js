exports.signRequired = function (req, res, next) {
    let _user = req.session.user
    if (!_user) {
        res.json({
            status: '0',
            msg: '请登陆',
            result: ''
        })
    } else {
        next()
    }
}

exports.adminRole = function (req, res, next) {
    let _user = req.session.user
    if (_user.role < 50) {
        res.json({
            status: '0',
            msg: '用户权限不够',
            result: ''
        })
    } else {
        next()
    }
}
