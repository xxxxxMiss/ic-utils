const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const dayjs = require('dayjs')

const pkgName = process.argv.slice(2)[0]

if (!pkgName) {
  console.error(chalk.red('you must specify a package name with this script:'))
  console.log()
  console.log(chalk.green('  example: npm run create axios'))
  console.log()
  process.exit(1)
}

const pkgPath = path.resolve(__dirname, '../packages')
const moduleDir = path.join(pkgPath, pkgName)
const srcDir = path.join(moduleDir, 'src')
fs.mkdirSync(moduleDir)
fs.mkdirSync(srcDir)
fs.writeFileSync(path.join(srcDir, 'index.js'), `/**\n *  created at ${dayjs().format('YYYY/MM/DD HH:mm')} by xxxxxMiss\n */`)

const pkgs = fs.readdirSync(pkgPath)
const packagePrefix = require(path.resolve(__dirname, '../package.json')).packagePrefix


pkgs.forEach(p => {
  const pkgJson = path.join(pkgPath, p, 'package.json')
  const name = `${packagePrefix}${p}`

  if (!fs.existsSync(pkgJson)) {
    const json = {
      name,
      version: '1.0.0',
      description: 'A lightly library for rapid daily development',
      main: 'dist/index.js',
      module: 'src/index.js',
      repository: {
        'type': 'git',
        'url': `https://github.com/xxxxxMiss/ic-utils/tree/master/packages/${p}`
      },
      keyword: [p],
      author: 'xxxxxMiss <xxxxxmiss@gmail.com> (https://github.com/xxxxxMiss)',
      license: 'MIT'
    }

    fs.writeFileSync(pkgJson, JSON.stringify(json, null, 2))
  }

  const readMe = path.join(pkgPath, p, 'README.md')
  if (!fs.existsSync(readMe)) {
    fs.writeFileSync(readMe, `### Install\n>$ npm i ${name} || yarn add ${name}`)
  }
})