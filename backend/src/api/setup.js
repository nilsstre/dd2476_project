const express = require('express')
const routs = express.Router()
const agencies = require('../../data/agencies.json')
const organisationNumber = require('../../data/organisationNumbers.json')
const years = require('../../data/years.json')

routs.get('/getFieldData', (_, response) =>
  response.status(200).send({ data: { agencies, organisationNumber, years } })
)

module.exports = routs
