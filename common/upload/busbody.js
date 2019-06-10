/**
 * Created with webstorm
 * User: njfu@iflytek.com
 * Date: 2019/5/17
 * Time: 10:34
 */
const express = require('express')
const path = require('path')
const Busboy = require('busboy')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.post('/uploadFile', function (req, res) {
  console.log(req.body)
  console.log(req.query)
  var busboy = new Busboy({headers: req.headers});
  busboy.on('file', function (fieldname, file, filename) {
    let dstpath = path.join(__dirname, './file/' + filename)
    checkDstPath(dstpath).then(() => {
      let writeStream = fs.createWriteStream(dstpath)
      file.on('data', function (data) {
        writeStream.write(data);
      });
      file.on('end', function () {
        writeStream.end();
        // return res.send({
        //   code: 0,
        //   msg: 'success'
        // })
      })
    }).catch(() => {
      return res.send({
        code: -1,
        msg: 'fail'
      })
    })
  })
  busboy.on('field', function (fieldname, val) {
  })
  busboy.on('finish', function () {
    return res.send({
      code: 0,
      msg: '上传成功'
    })
  });
  req.pipe(busboy);
})

function checkDstPath(dstPath) {
  return new Promise((resolve, reject) => {
    try {
      fs.exists(path.dirname(dstPath), (exist) => {
        if (!exist) {
          fs.mkdir(path.dirname(dstPath), (err) => {
            if (err) {
              reject('mkdir error')
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    } catch (e) {
      reject(e.message || e.statusMessage)
    }
  })
}


app.get('/', function (req, res) {
  res.send({
    msg: "it's ok"
  })
})


app.listen(8089)
