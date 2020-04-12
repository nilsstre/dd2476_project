const { client } = require('../../elastic/handler')

const changeFieldType = ({ changeObject, index }) => client.indices
    .putMapping({
      index,
      body: {
        properties: {
          ...changeObject
        }
      }
    })
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => console.error(JSON.stringify(error.meta.body.error, null, 2)))


changeFieldType({
  changeObject: {
    agency: {
      type: 'keyword'
    },
    oganisationNumber: {
      type: 'keyword'
    },
    createdAt: {
      type: 'date'
    }
  },
  index: ['arsredovisningar']
})
