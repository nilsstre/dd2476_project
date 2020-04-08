const fs = require('fs')
const Promise = require('bluebird')
const helpers = require('../helpers')
const handleIndices = require('../../elastic/handleIndices')
const PATH_TO_DATA = process.env.PATH_TO_DATA

const addToRegleringsbrev = () => {
  fs.readdir(
    `${PATH_TO_DATA}/regleringsbrev/`,
    (error, files) => {
      if (error) {
        console.error(error)
      } else {
        const agenciesArray = helpers.groupAgencies(files)
        Promise.each(
          agenciesArray,
          (agency) => handleIndices.updateRegleringsbrev(agency),
          { concurrency: 3 }
        )
      }
    }
  )
}

addToRegleringsbrev()
