const express = require('express')
const path = require('path')
const app = express()

//* 引入json解析中间件
const bodyParser = require('body-parser')
//* 添加json解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//* 静态文件
app.use('/static', express.static(path.join(__dirname, 'static')))

//* 路由
const birds = require('./router/birds')
app.use('/api/birds', birds)


// 允许所有的请求形式
app.use(function (err, req, res, next) {
  console.log(err)
})
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
app.listen(3000)
