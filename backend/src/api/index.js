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

routs.get('/search/:index/:query', async (request, response) => {
  const requestBody = esb.requestBodySearch().query(esb.matchQuery('_id', '2006_Alkoholsortimentsnämnden.pdf'))
  console.log(requestBody.toJSON())
  //const { index, query } = request.params
  return client
    .search({
      index: 'regleringsbrev',
      type: '_doc',
      body: requestBody.toJSON()
    })
    .then((result) => {
      const {
        hits: { hits }
      } = result
      console.log('hits', hits)
      return response.status(200).send({ hits })
    })
    .catch((error) => response.status(500).send({ error }))
})

routs.get('/health', (_, response) =>
  request
    .get(elasticURL + '/_cluster/health')
    .on('response', (result) => response.status(200).send({ result }))
    .on('error', (error) => response.status(500).send({ error }))
)

module.exports = routs
