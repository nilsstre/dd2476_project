const { client } = require('../../elastic/handler')

const createIndex = () =>
  client.indices
    .create(
      {
        index: 'regleringsbrev',
        body: {
          mappings: {
            properties: {
              agency_id: {
                type: 'integer'
              },
              agency: {
                type: 'keyword'
              },
              organization_number: {
                type: 'keyword'
              },
              source_url: {
                type: 'text'
              },
              year: {
                type: 'date'
              },
              goals_and_reporting: {
                type: 'text'
              },
              objective: {
                type: 'text'
              }
            }
          }
        }
      },
      {
        ignore: [400]
      }
    )
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => console.error(JSON.stringify(error, null, 2)))

createIndex()