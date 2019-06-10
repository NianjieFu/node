/**
 * Created with 2019/4/9
 * User: njfu@iflytek.com
 * Date: 2019/4/15
 * Des: 解压缩 - 7z.exe
 */

const path = require('path')
const cp = require('child_process')

class Unzip7z {
  ProgressDataFormat(data) {
    let progress = ''
    let str = data.toString().replace(/(^\s*)|(\s*$)/g, '').replace(/\\/g, '/')
    let strArr = str.split(" ")
    if (strArr[0] && /%$/.test(strArr[0])) {
      progress = strArr[0]
    } else {
    }
    return progress
  }

  /**
   * 解压-7z T
   * @args Array
   * 必选参数 "x/e",zipPath,"-o"+dstPath x保留目录解压 e将文件解压至目录
   * 可选参数 "-y","-aoa","-bsp1","-bb0",[目标文件夹/文件]
   * 例：["x/e","H:/1.zip","-oH:/1"]
   * 注意：(-y:所有确认选项都默认为是(即不出现确认提示),为了保证执行完收到回调都需添加)
   * */
  async unzipProgress(zipPath, dstPath, getProgress) {
    let args = ['x', zipPath, '-y', '-aoa', '-o' + dstPath, '-bsp1', '-bb0']
    getProgress && getProgress('0%')
    let ret = await this.exec7zDoc(args, (data) => {
      let progress = this.ProgressDataFormat(data)
      if (progress) {
        getProgress && getProgress(progress)
      }
    })
    if (ret === 0) {
      getProgress && getProgress('100%')
    }
    return ret
  }

  async zip(dstPath, zipPath) {
    let args = ['a', zipPath, dstPath]
    let ret = await this.exec7zDoc(args)
    return ret
  }

  async unzip(zipPath, dstPath) {
    let args = ['x', zipPath, '-y', '-aoa', '-o' + dstPath, '-bsp1', '-bb0']
    let ret = await this.exec7zDoc(args)
    return ret
  }

  exec7zDoc(args, getOutData) {
    let isHasReturn = false // 是否已经返回结果了
    return new Promise((resolve, reject) => {
      let exePath = path.join(process.cwd(), 'components/7z/7z.exe')
      let exe = cp.spawn(exePath, args)
      exe.stdout.on('data', function (data) {
        //pass
        getOutData && getOutData(data)
      })
      exe.stderr.on('data', function (data) {
        isHasReturn = true
        reject(data.toString('utf-8'))
      })
      exe.on('close', function (ret) {
        if (ret === 0) {
          resolve(ret)
        } else {
          if (!isHasReturn) {
            reject(ret)
          }
        }
      })
    })
  }
}

let instance = null

const getInstance = function () {
  if (!instance) {
    instance = new Unzip7z()
  }
  return instance
}
exports = module.exports = getInstance()
