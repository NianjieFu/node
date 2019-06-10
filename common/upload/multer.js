const express = require('express')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const app = express()


const storage = multer.diskStorage({
  destination: function (req, file, next) {
    let dirpath = path.join(__dirname, '/file/')
    checkDirPath(dirpath).then(() => {
      next(null, dirpath)
    }).catch((e) => {
      next(e, '')
    })
  },
  filename: function (req, file, next) {
    next(null, req.body.fileName)
  }
})
const upload = multer({storage: storage}).any()

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.send({
        code: -1,
        msg: err.message
      })
    } else {
      return res.send({
        code: 0,
        msg: 'Files is uploaded.'
      })
    }
  })
})

app.get('/checkFileCount', function (req, res) {
/*  if (Object.keys(fileUploadInfo).length >= 15) {
    return res.send({
      code: -1,
      msg: 'hold on 3s'
    })
  } else {
    let uuid = Date.now().toString()
    fileUploadInfo[uuid] = uuid
    return res.send({
      code: 0,
      uuid: uuid,
      msg: 'you can upload'
    })
  }*/
  return res.send({
    code: 0,
    uuid: '',
    msg: 'you can upload'
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

function checkDirPath(dirPath) {
  return new Promise((resolve, reject) => {
    try {
      fs.exists(dirPath, (exist) => {
        if (!exist) {
          fs.mkdir(dirPath, (err) => {
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

app.listen(3090)
