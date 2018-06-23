const path = require('path')
const fs = require('fs')
const signale = require('signale')

const vuepressConfigPath = path.join(__dirname, '..', 'docs/.vuepress/config.js')
const vuepressConfig = require(vuepressConfigPath)

const pkgPath = path.join(__dirname, '..', 'packages')
const destPath = path.join(__dirname, '..', 'docs/plugins')
const ignore = require(path.join(__dirname, '..', 'lerna.json')).commands.publish.ignore

const dirs = fs.readdirSync(pkgPath).filter(d => d !== '.DS_Store' && ignore.indexOf(d) === -1)
const sidebar = []

dirs.forEach(d => {
  const src = path.join(pkgPath, d, 'README.md')
  if (fs.existsSync(src)) {
    const rs = fs.createReadStream(src)
    const ws = fs.createWriteStream(path.join(destPath, `${d}.md`))
    rs.pipe(ws)
    sidebar.push(`/plugins/${d}`)
  }
})
signale.success('docs generate successfully')

vuepressConfig.themeConfig.locales['/'].sidebar = sidebar
const data = `module.exports = ${JSON.stringify(vuepressConfig, null, 2)}`
fs.writeFileSync(vuepressConfigPath, data, 'utf8')
signale.success('docs write successfully')
