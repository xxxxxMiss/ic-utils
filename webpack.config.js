const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const uppercamelcase = require('uppercamelcase')
const webpack = require('webpack')
const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const pkgs = fs.readdirSync(`${__dirname}/packages`)
const ignorePkgs = _.get(require('./lerna.json'), 'commands.publish.ignore')

function getConfig ({ path, library, externals }) {
  const distPath = `${path}/dist`
  const config = {
    devtool: 'source-map',
    mode: isProd ? 'production' : 'development',
    entry: `${path}/index.js`,
    output: {
      filename: `index.${isProd ? 'min.' : '' }js`,
      path: distPath,
      library,
      libraryTarget: 'umd',
      // umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader'
        }
      ]
    }
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
  if (err) console.error(chalk.red(err.message))

  if (isProd) {
    console.log(chalk.green('build prod-completed'))
  } else {
    console.log(chalk.blue('build dev-completed'))
  }
}))
