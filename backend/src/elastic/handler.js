const { Client } = require('@elastic/elasticsearch')
const elasticURL = process.env.ELASTIC_URL

const createClient = () => {
  const client = new Client({ node: elasticURL })
  client.ping(
    {},
    (error) => {
      if (error) {
        console.error('Cannot connect to Elasticsearch.', error)
      } else {
        console.log('Connected to Elasticsearch.')
      }
    }
  )
  return client
}

module.exports = {
  client: createClient(),
  elasticURL
}
