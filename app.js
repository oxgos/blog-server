var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var bodyParser = require('body-parser')

var index = require('./routes/index')
var users = require('./routes/users')
var articles = require('./routes/articles')
var categories = require('./routes/categories')
var feUser = require('./routes/feUser')
var feCategories = require('./routes/feCategories')
var feArticles = require('./routes/feArticles')

var app = express()

var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://127.0.0.1:27017/blog')
mongoose.connection.on('connected', () => {
  console.log('Mongodb connected success')
})
mongoose.connection.on('error', () => {
  console.log('Mongodb connected fail')
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongodb disconnected')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser('blogsecrettoken'))
app.use(session({
  secret: 'blogsecrettoken',
  cookie: {
    maxAge: 24 * 3600 * 1000 * 7
  },
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/blog'
  }),
  resave: false,
  saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, 'public')))

// 记录访问次数
/* app.use((req, res, next) => {
  if (req.session.views) {
    req.session.views++
    console.log(`欢迎第 ${req.session.views} 次访问`)
    next()
  } else {
    req.session.views = 1
    console.log(`欢迎首次访问`)
    next()
  }
}) */

app.use('/', index)
app.use('/users', users)
app.use('/articles', articles)
app.use('/categories', categories)
app.use('/feUser', feUser)
app.use('/feCategories', feCategories)
app.use('/feArticles', feArticles)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
