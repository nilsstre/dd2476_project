const express = require('express')
const routs = express.Router()
const request = require('request')
const { Client } = require('@elastic/elasticsearch')
const esb = require('elastic-builder')
const elasticURL = process.env.ELASTIC_URL

console.log('elasticURL', elasticURL)
const client = new Client({
  node: elasticURL
})

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
    .then((result) => response.status(200).send({ result })
    )
    .catch((error) => response.status(500).send({ error }))
})

routs.get('/health', (_, response) =>
  request
    .get(elasticURL + '/_cluster/health')
    .on('response', (result) => response.status(200).send({ result }))
    .on('error', (error) => response.status(500).send({ error }))
)

module.exports = routs
