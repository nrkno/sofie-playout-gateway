var fs = require('fs')
let path = './package.json'
let package = JSON.parse(fs.readFileSync(path))
package.versionTime = Date.now()
fs.writeFileSync(path, JSON.stringify(package, null, 2) + '\n')

