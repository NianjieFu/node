/**
 * Created with 2019/4/9
 * User: njfu@iflytek.com
 * Date: 2019/4/9
 * Des: 解压缩
 */
const yauzl = require('yauzl')
const yazl = require('yazl')
const path = require('path')
const fs = require('fs')

class Unzip {

  // * 解压
  unzipYauzl(zipPath, dstPath) {
    let isHasReturn = false // 是否已经返回结果了
    return new Promise((resolve, reject) => {
      yauzl.open(zipPath, {lazyEntries: true}, (err, zipfile) => {
        if (err) {
          isHasReturn = true
          reject(err)
        } else {
          zipfile.readEntry()
          zipfile.on('entry', (entry) => {
            let fileName = entry.fileName
            let dstFile = path.join(dstPath, fileName)
            if (/\/$/.test(fileName)) {
              // 文件夹
              fs.mkdir(dstFile, {recursive: true}, (err) => {
                if (err) {
                  isHasReturn = true
                  reject(err)
                } else {
                  zipfile.readEntry()
                }
              })
            } else {
              // 文件
              fs.mkdir(path.dirname(dstFile), {recursive: true}, (err) => {
                if (err) {
                  isHasReturn = true
                  reject(err)
                }
                zipfile.openReadStream(entry, (err, readStream) => {
                  if (err) {
                    isHasReturn = true
                    reject(err)
                  } else {
                    readStream.on("end", function () {
                      zipfile.readEntry()
                    })
                    readStream.pipe(fs.createWriteStream(dstFile))
                  }
                });
              })
            }
          })
          zipfile.on('error', (err) => {
            if (!isHasReturn) {
              isHasReturn = true
              reject(err)
            }
          });
          zipfile.on('end', (ret) => {
            if (!isHasReturn) {
              isHasReturn = true
              resolve(ret)
            }
          });
          zipfile.on('cloase', (ret) => {
            if (!isHasReturn) {
              isHasReturn = true;
              resolve(ret)
            }
          })
        }
      })
    })
  }

  // * 读取文件夹下所有文件
  readDirAllFile(dirPath) {
    let result = []
    return new Promise((resolve, reject) => {
      function readOneDirFile(dpath) {
        let files = fs.readdirSync(dpath)
        files.forEach(el => {
          let fPath = path.join(dpath, el)
          let stat = fs.statSync(fPath);
          if (stat.isDirectory() === true) {
            readOneDirFile(fPath)
          }
          if (stat.isFile() === true) {
            result.push(fPath)
          }
        })
      }

      try {
        readOneDirFile(dirPath)
      } catch (e) {
        reject(e)
      }
      resolve(result)
    })
  }

  // * 压缩
  zipYazl(dstPath, zipPath) {
    return new Promise((resolve, reject) => {
      dstPath = path.resolve(dstPath)
      zipPath = path.resolve(zipPath)
      let zipfile = new yazl.ZipFile()
      try {
        this.readDirAllFile(dstPath).then(files => {
          for (let i = 0; i < files.length; i++) {
            let file = files[i]
            // 路径处理 - 1.正反斜杆 2.目录头部斜杆
            zipfile.addFile(file, path.join(path.basename(dstPath), path.resolve(file).replace(dstPath, '')))
          }
          zipfile.outputStream.pipe(fs.createWriteStream(zipPath)).on("close", () => {
            resolve('done')
          })
          zipfile.end()
        }).catch(err => {
          reject(err)
        })
      } catch (e) {
        reject(e)
      }
    })
  }
}

let instance = null

const getInstance = function () {
  if (!instance) {
    instance = new Unzip()
  }
  return instance
}
exports = module.exports = getInstance()
