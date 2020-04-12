const express = require('express')
const routs = express.Router()
const esb = require('elastic-builder')
const { client } = require('../elastic/handler')
const { makeQuery } = require('../elastic/search')

routs.get('/health', (_, response) =>
  client.cluster
    .health()
    .then((result) => response.status(200).send(result.body))
    .catch((error) => {
      console.error(error)
      return response
        .status(500)
        .send({ message: 'Failed to get health from Elastic', error })
    })
)

routs.get('/ping', (_, response) =>
  client
    .ping()
    .then((result) => response.status(200).send(result.body))
    .catch((error) => {
      console.error(error)
      return response
        .status(500)
        .send({ message: 'Failed to ping Elastic', error })
    })
)

routs.post('/search', (request, response) => {
  return makeQuery({ query: request.body, client })
    .then((result) => response.status(200).send({ data: result }))
    .catch((error) => {
      console.error(JSON.stringify(error, null, 2))
      return response.status(500).send()
    })
})

module.exports = routs
