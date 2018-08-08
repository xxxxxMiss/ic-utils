const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const uppercamelcase = require('uppercamelcase')
const webpack = require('webpack')
const signale = require('signale')

const isProd = process.env.NODE_ENV === 'production'

const pkgs = fs.readdirSync(`${__dirname}/packages`)
const ignorePkgs = _.get(require('./lerna.json'), 'commands.publish.ignore')

function getConfig ({ path, library, externals }) {
  const distPath = `${path}/dist`
  const config = {
    devtool: 'source-map',
    mode: isProd ? 'production' : 'development',
    entry: `${path}/src/index.js`,
    output: {
      filename: `index.${isProd ? 'min.' : '' }js`,
      path: distPath,
      library,
      libraryTarget: 'umd',
      // umdNamedDefine: true
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.js$/,
    //       exclude: /(node_modules)/,
    //       loader: 'babel-loader'
    //     }
    //   ]
    // }
  }
  if (externals) {
    config.externals = externals
  }
  return config
}

const configs = _.xor(pkgs, ignorePkgs).map(dir => {
  const p = path.resolve(__dirname, `packages/${dir}`)
  const pkg = require(`${p}/package.json`)
  return getConfig({
    path: p,
    library: uppercamelcase(pkg.name),
    externals: pkg.externals
  })
})

configs.forEach(c => webpack(c, (err, stats) => {
  if (err) {
    if (err.details) {
      return signale.fatal(err.details)
    }
    return signale.fatal(err.stack || err)
  }

  if (stats.hasErrors()) {
    return signale.fatal(stats.toJson().errors)
  }

  if (isProd) {
    signale.success('build prod-completed')
  } else {
    signale.success('build dev-completed')
  }
}))
