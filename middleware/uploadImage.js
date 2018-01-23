const fs = require('fs')
const path = require('path')

exports.uploadImage = (req, res, next) => {
    // 用于判断是否element ui上传组件
    if (req.headers.flag) {
        res.json({
			status: '1',
			msg: '缓存图片',
			result: ''
		})
    } else {
        // 用于判断是否有新上传图片
        if (req.files.avatar) {
            let avatarData = req.files.avatar
            let filePath = avatarData.path
            let originalFilename = avatarData.originalFilename
            if (originalFilename) {
                fs.readFile(filePath, (err, data) => {
                    let timestamp = Date.now()
                    let type = avatarData.type.split('/')[1]
                    let avatar = `${timestamp}.${type}`
                    let newPath = path.join(__dirname, '../', `/public/upload/${avatar}`)
        
                    fs.writeFile(newPath, data, (err) => {
                        req.avatarUrl = `upload/${avatar}`
                        next()
                    })
                })
            } else {
                next()
            }
        } else {
            next()
        }
    }
}
