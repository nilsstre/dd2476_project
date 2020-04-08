const express = require('express')
const routs = express.Router()
const esb = require('elastic-builder')
const { client } = require('../elastic/handler')

routs.get('/search/:index/:field/:query', async (request, response) => {
  const { index, query, field } = request.params

  const requestBody = esb
    .requestBodySearch()
    .query(esb.matchQuery(field, query))

  return client
    .search({
      index,
      body: requestBody.toJSON()
    })
    .then((result) => response.status(200).send({ result }))
    .catch((error) => response.status(500).send({ error }))
})

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

module.exports = routs
