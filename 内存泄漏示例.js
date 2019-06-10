// * 内存泄露
function format(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

let theThing = null
let replaceThing = function () {
  let leak = theThing
  let unused = function () {
    if (leak) {
      console.log('hi')
    }
  }
  // 不断修改引用
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log('a')
    }
  }

  global.gc() // 手动触发GC，保证能回收的内存都回收了
}
setInterval(() => {
  replaceThing()
  console.log(`heapUsed: ${format(process.memoryUsage().heapUsed)}`)
}, 100)

// *启动命令 node -expose-gc test.js
