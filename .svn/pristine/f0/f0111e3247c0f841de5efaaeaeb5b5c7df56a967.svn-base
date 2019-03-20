'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('正为生产环境打包，耐心点哦...')
spinner.color = 'green';
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  打包失败.\n' ))
      process.exit(1)
    }
    console.log(chalk.cyan('  恭喜你打包完成.\n' ))
    console.log(chalk.yellow(
      '  提示: 构建文件的目的是在HTTP服务器上提供服务 '+
      '  本地打开 index.html 不会生效'
    ))
  })
})
