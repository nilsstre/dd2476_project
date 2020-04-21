const fs = require('fs')
const striptags = require('striptags')
const { DateTime } = require('luxon')
const Promise = require('bluebird')
const { client } = require('../../elastic/handler')
const PATH_TO_DATA = process.env.PATH_TO_DATA

const years = [
  2003,
  2004,
  2005,
  2006,
  2007,
  2008,
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020
]

const filesToJSON = ({ files, year }) =>
  files
    .filter((file) => file.match(new RegExp(`AGENCY_ID-\\d+-${year}.json`)))
    .map((file) => fs.readFileSync(`${PATH_TO_DATA}/${file}`, 'utf8'))
    .map((obj) => JSON.parse(obj))
    .map((obj) => ({
      ...obj,
      goals_and_reporting: striptags(obj['goals_and_reporting']),
      objective: striptags(obj['objective']),
      year: DateTime.fromObject({ year: obj.year }).toISO()
    }))

const uploadJSON = async () => {
  fs.readdir(`${PATH_TO_DATA}`, async (error, files) => {
    if (error) {
      console.error(error)
    } else {
      Promise.each(
        years,
        async (year) => {
          const objects = filesToJSON({ files, year })
          const body = objects.flatMap((obj) => [
            { index: { _index: 'regleringsbrev' } },
            obj
          ])

          const { body: bulkResponse } = await client.bulk({
            refresh: 'true',
            body
          })

          if (bulkResponse.errors) {
            const erroredDocuments = []
            bulkResponse.items.forEach((action, i) => {
              const operation = Object.keys(action)[0]
              if (action[operation].error) {
                erroredDocuments.push({
                  status: action[operation].status,
                  error: action[operation].error,
                  operation: body[i * 2],
                  document: body[i * 2 + 1]
                })
              }
            })
            console.log(erroredDocuments)
          }

          const { body: count } = await client.count({
            index: 'regleringsbrev'
          })
          console.log(count)
        },
        { concurrency: 1 }
      )
    }
  })
}

uploadJSON()
