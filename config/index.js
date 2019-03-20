'use strict'
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/gisapiservice/': {
      //     /*****测试环境******/
      //     target:'http://182.150.22.191:9204/',
      // },
      // '/api/': {
      //     /*****测试环境******/
      //     target:'http://182.150.22.191:9205/',
      // },
      '/gisapiservice/': {
        /** ***测试环境******/
        target: 'http://gisserver.wwvas.com:9204/'
        // target:'http://192.168.50.120:8065/',//尤
      },
      '/newApi/': {
        target: 'http://gisserver.wwvas.com:9209/',
        changeOrigin: true,
        pathRewrite: {
          '^/newApi': '/api'
        }
      },
      '/api/': {
        /** ***测试环境******/
        target: 'http://gisserver.wwvas.com:9205/'
      },
      '/vehicle/': {
<<<<<<< .mine
          /*****测试环境******/
          // target:'http://192.168.50.120:8065/',//尤
          target:'http://172.16.10.20:8087/'
||||||| .r8693
          /*****测试环境******/
          target:'http://192.168.50.120:8065/',//尤
=======
        /** ***测试环境******/
        target: 'http://192.168.50.120:8065/' // 尤
>>>>>>> .r8874
      },
      '/chart/': {
        target: 'http://gisserver.wwvas.com:9209/',
        changeOrigin: true,
        pathRewrite: {
          '^/chart': '/gisapiservice/Statistics'
        }
      },
      '/photo': {
        target: 'http://www.wwvas.com:9119/',
        changeOrigin: true,
        pathRewrite: {
          '^/photo': '/vasms-web'
        }
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
