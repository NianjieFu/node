/**
 * Created with 2019/4/28
 * User: njfu@iflytek.com
 * Date: 2019/4/28
 * Des: pdf转图片
 */

const path = require('path')
const cp = require('child_process')

class Pdf2Img {
  constructor() {
    this.options = {
      type: 'jpg',
      density: 150, // 分辨率
      outputdir: null, // 文件夹必须确保已存在
      outputname: null, // 返回前缀名outputname_%d
      startpage: 1, // 起始页码
      endpage: '' // 结束页码
    }
  }

  /**
   * pdf转图片
   * opts详见options
   * 命令行参数见ghostscript\readme.md
   */
  async convert(pdfPath, opts) {
    pdfPath = path.join(pdfPath)
    let type = opts.type || this.options.type
    let density = opts.density || this.options.density
    let outputdir = opts.outputdir || this.options.outputdir
    let outputname = opts.outputname || this.options.outputname
    let startpage = opts.startpage || this.options.startpage
    let endpage = opts.endpage || this.options.endpage
    let outpath = path.join(outputdir, `${outputname}_%d.${type}`)
    let args = [
      '-q',
      '-dNOSAFER',
      '-dBATCH',
      '-dNOPAUSE',
      '-dNOPROMPT',
      `-r${density}`,
      '-sDEVICE=pngalpha',
      `-sOutputFile=${outpath}`,
      `-dFirstPage=${startpage}`
    ]
    if (endpage) {
      args.push(`-dLastPage=${endpage}`)
    }
    args.push(pdfPath)
    try {
      let ret = await this.execGs(args)
      return ret
    } catch (e) {
      throw e
    }
  }

  execGs(args, getOutData) {
    let isHasReturn = false // 是否已经返回结果了
    return new Promise((resolve, reject) => {
      let exePath = path.join(process.cwd(), 'components/ghostscript/gswin32c.exe')
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
        if (!isHasReturn) {
          resolve(ret)
        }
      })
    })
  }
}

let instance = null

const getInstance = function () {
  if (!instance) {
    instance = new Pdf2Img()
  }
  return instance
}
exports = module.exports = getInstance()
