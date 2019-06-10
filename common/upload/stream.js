const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
app.post("/uploadFile", (req, res, next) => {
  let dstpath = path.join(__dirname, './file/' + 'test.png')
  let writeStream = fs.createWriteStream(dstpath)
  req.pipe(writeStream)
  req.on("data", function (data) {
    console.log(data.length)
    writeStream.write(data)
  }).on("error", function () {
    res.send({
      code: -1
    })
  }).on("end", function () {
    console.log('end')
    writeStream.end()
    res.send({
      code: 0
    })
  })
})

app.listen(8089)
