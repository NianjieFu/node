const log4js = require('log4js')

class Logger {
  constructor(tag) {
    tag = tag || 'log'
    let config = {
      appenders: {},
      categories: {
        default: {
          appenders: [],
          level: 'trace'
        }
      }
    }
    config.appenders[`${tag}.`] = {
      type: 'console',
      level: 'trace'
    }
    config.appenders[tag] = {
      type: 'dateFile',
      filename: './log/ser.log',
      pattern: '.yyyy-MM-dd-hh',
      compress: true
    }
    config.categories.default.appenders.push(`${tag}.`)
    config.categories.default.appenders.push(tag)
    log4js.configure(config)
    return log4js.getLogger(tag)
  }
}

exports = module.exports = function (tag) {
  return new Logger(tag)
}
