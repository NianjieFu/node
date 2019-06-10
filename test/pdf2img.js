const pdf2img = require('../common/pdfUtils/pdf2img')
const path = require('path')
pdf2img.convert(path.join(__dirname, '/file/1.pdf'), {
  type: 'jpg',
  density: 150, // 分辨率
  outputdir: path.join(__dirname, '/file/'),
  outputname: 'test', // 返回前缀名outputname_%d
  startpage: 2, // 起始页码
  endpage: 4 // 结束页码
}).then(ret => {
  console.log(ret)
}).catch(err => {
  console.error(err)
})
