const fs = require('fs')
const path = require('path')

exports.uploadImage = (req, res, next) => {
    if (req.headers.flag) {
        next()
    } else {
        let avatarData = req.files.image
        let filePath = avatarData.path
        let originalFilename = avatarData.originalFilename
        if (originalFilename) {
            fs.readFile(filePath, (err, data) => {
                let timestamp = Date.now()
                let type = avatarData.type.split('/')[1]
                let image = `${timestamp}.${type}`
                let newPath = path.join(__dirname, '../', `/public/upload/${image}`)
    
                fs.writeFile(newPath, data, (err) => {
                    req.image = image
                    next()
                })
            })
        } else {
            next()
        }
    }
}