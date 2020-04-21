const fs = require('fs')
const striptags = require('striptags')
const { DateTime } = require('luxon')
const Promise = require('bluebird')
const PATH_TO_DATA = process.env.PATH_TO_DATA

fs.readdir(`${PATH_TO_DATA}`, (error, files) => {
  if (error) {
    console.error(error)
  } else {
    const agencies = new Set()
    const organisationNumbers = new Set()

    files.forEach((fileName) => {
      const fileContent = JSON.parse(
        fs.readFileSync(`${PATH_TO_DATA}/${fileName}`, 'utf8')
      )
      agencies.add(fileContent.agency)
      organisationNumbers.add(fileContent.organization_number)
    })

    console.log(
      JSON.stringify(
        [...agencies]
          .map((value) => value.trim())
          .filter(Boolean)
          .sort(),
        null,
        2
      )
    )
  }
})
