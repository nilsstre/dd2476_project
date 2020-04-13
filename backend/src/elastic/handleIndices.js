const { client } = require('./handler')

const TIME_OUT = 10000

const updateRegleringsbrev = (obj) => update({ obj, index: 'regleringsbrev' })

const updateArsredovisning = (obj) => update({ obj, index: 'arsredovisningar' })

const update = ({ obj, index }) => {
  const { id, agency, date, oranisationNumber } = obj
  return client
    .updateByQuery({
      index,
      body: {
        query: {
          match: {
            _id: `${id}`
          }
        },
        script: {
          inline: `ctx._source.agency = \"${agency}\"; ctx._source.createdAt = \"${date}\"; ctx._source.organisationNumber = \"${oranisationNumber}\"`
        }
      }
    })
    .then(() => console.log('Updated: ', id))
    .catch(async (error) => {
      if (error.body && error.body.error && error.body.error.caused_by.type === 'circuit_breaking_exception') {
        console.log(`Waiting for ${TIME_OUT / 1000}s`)
        await new Promise((r) => setTimeout(r, TIME_OUT))
        return update({ obj, index })
      } else {
        //console.error('error', JSON.stringify(error, null, 2))
        return update({ obj, index})
      }
    })
}

module.exports = {
  updateRegleringsbrev,
  updateArsredovisning
}
