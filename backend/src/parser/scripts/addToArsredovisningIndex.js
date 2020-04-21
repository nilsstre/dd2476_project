const fs = require('fs')
const Promise = require('bluebird')
const handleIndices = require('../../elastic/handleIndices')
const helpers = require('../helpers')
const PATH_TO_DATA = process.env.PATH_TO_DATA

const addToArsredovisningIndex = () => {
  fs.readdir(`${PATH_TO_DATA}/arsredovisningar/`, (error, files) => {
    if (error) {
      console.error('error', error)
    } else {
      const agenciesArray = helpers.groupAgencies(files)
      Promise.each(
        agenciesArray,
        (agency) => handleIndices.updateArsredovisning(agency),
        { concurrency: 3 }
      )
    }
  })
}

addToArsredovisningIndex()
