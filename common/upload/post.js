const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: false}))

app.post('/test', function (req, res) {
  console.log(req.body)
  console.log(req.query)
})


app.listen(8080)
