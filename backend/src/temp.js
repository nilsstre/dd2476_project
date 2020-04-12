const fs = require('fs')
const helpers = require('./parser/helpers')
const PATH_TO_DATA = process.env.PATH_TO_DATA

fs.readdir(`${PATH_TO_DATA}/regleringsbrev`, (error, files) => {
  if (error) {
    console.error(error)
  } else {
    const agenciesArray = helpers.groupAgenciesForFile(files)
    fs.writeFile('./data.json', JSON.stringify(agenciesArray, null, 2), (error) => error && console.error(error))
  }
})