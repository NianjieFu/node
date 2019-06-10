const express = require('express')
const path = require('path')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const app = express()

// default options
app.use(fileUpload({
  useTempFiles: false,
  tempFileDir: path.join(__dirname, '/tmp/')
}))

app.post('/upload', function (req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.send({
      code: -1,
      msg: 'No files were uploaded.'
    })
  }

  let dstpath = path.join(__dirname, '/file/', req.body.fileName)

  let sampleFile = req.files.file
  uploadFile(sampleFile, dstpath).then(ret => {
    return res.send({
      code: 0,
      msg: ret
    })
  }).catch(e => {
    return res.send({
      code: -1,
      msg: e
    })
  })
})

app.get('/', function (req, res) {
  res.send({
    msg: "it's ok"
  })
})

function saveMvFile(file, dstPath) {
  return new Promise((resolve, reject) => {
    file.mv(dstPath, (err) => {
      if (err) {
        reject('File uploaded fail')
      } else {
        resolve('File uploaded!')
      }
    })
  })
}


function uploadFile(file, dstPath) {
  return new Promise((resolve, reject) => {
    try {
      fs.exists(path.dirname(dstPath), (exist) => {
        if (!exist) {
          fs.mkdir(path.dirname(dstPath), (err) => {
            if (err) {
              reject('mkdir error')
            } else {
              saveMvFile(file, dstPath).then(ret => {
                resolve(ret)
              }).catch(err => {
                reject(err)
              })
            }
          })
        } else {
          saveMvFile(file, dstPath).then(ret => {
            resolve(ret)
          }).catch(err => {
            reject(err)
          })
        }
      })
    } catch (e) {
      reject(e.message || e.statusMessage)
    }
  })
}


app.listen(3090)
console.log(__dirname)
