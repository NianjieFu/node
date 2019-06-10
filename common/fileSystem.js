/**
 * Created with 2019/4/2
 * User: njfu@iflytek.com
 * Date: 2019/4/9
 * Des: 文件操作
 */

const fs = require('fs')
const path = require('path')

class FileSystem {
  // * 新建文件夹
  mkdir(dirPath) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, {recursive: true}, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  // * 删除单个文件夹
  rmdir(dirPath) {
    return new Promise((resolve, reject) => {
      fs.rmdir(dirPath, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  // * 删除单个文件
  unlink(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

  // * 读取文件夹
  readdir(path, options) {
    return new Promise((resolve, reject) => {
      options = Object.assign({}, options)
      fs.readdir(path, options, (err, files) => {
        if (err) {
          reject(err)
        } else {
          resolve(files)
        }
      })
    })
  }

  // * 查看文件状态
  stats(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          reject(err)
        } else {
          resolve(stats)
        }
      })
    })
  }

  // * 清空文件夹
  async clearDir(dirPath, options) {
    try {
      let files = await this.readdir(dirPath)
      for (let i = 0; i < files.length; i++) {
        let filename = files[i]
        let file = path.join(dirPath, filename)
        let stats = await this.stats(file)
        if (stats.isFile()) {
          await this.unlink(file)
        } else {
          await this.clearDir(file, options)
          await this.rmdir(file, options)
        }
      }
      return true
    } catch (e) {
      throw e
    }
  }

  // * 读文件
  readFile(path, options) {
    return new Promise((resolve, reject) => {
      options = Object.assign({'encoding': 'utf-8'}, options)
      fs.readFile(path, options, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  // * 写文件
  // * data - 1.buffer new Uint8Array(Buffer.from('Node.js中文网')) 2.string字符串
  writeFile(path, data, options) {
    return new Promise((resolve, reject) => {
      options = Object.assign({'encoding': 'utf-8'}, options)
      fs.writeFile(path, data, options, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }

}

let instance = null

const getInstance = function () {
  if (!instance) {
    instance = new FileSystem()
  }
  return instance
}
exports = module.exports = getInstance()
