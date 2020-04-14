const express = require('express')
const routs = express.Router()
const agencyOrganisationNumber = require('../../data/agencyOrganisationNumber.json')
const years = require('../../data/years.json')

routs.get('/getFieldData', (_, response) =>
  response.status(200).send({ data: { agencyOrganisationNumber, years } })
)

module.exports = routs
