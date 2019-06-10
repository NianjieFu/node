const express = require('express')
const router = express.Router()

// 中间件
router.use(function timeLog(req, res, next) {
  // console.log('Time: ', Date.now())
  next()
})

router.get('/getBird', function (req, res) {
  console.log(req.query)
  console.log(req.params)
  console.log(req.body)
  res.send(req.query)
})

router.post('/setBird', function (req, res) {
  console.log(req.query)
  console.log(req.params)
  console.log(req.body)
  res.send(req.body || {})
})

module.exports = router
