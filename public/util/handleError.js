exports.handleError = function(err) {
    return {
        status: '0',
        msg: err.message,
        result: ''
    }
}