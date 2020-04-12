const { DateTime } = require('luxon')
const R = require('ramda')

const getQuery = (query) => {
  const { textQuery, agencies, organisationNumbers, years } = query
  let newQuery = []

  if (textQuery) {
    newQuery = [...newQuery, { match: { content: textQuery } }]
  }

  if (agencies) {
    newQuery = [...newQuery, agencies.map((agency) => ({ match: { agency } }))]
  }

  if (organisationNumbers) {
    newQuery = [
      ...newQuery,
      organisationNumbers.map((organisationNumber) => ({
        match: { organisationNumber }
      }))
    ]
  }

  if (years) {
    newQuery = [
      ...newQuery,
      years.map((year) => ({
        match: {
          createdAt: DateTime.fromObject({ year }).toISO()
        }
      }))
    ]
  }

  return R.flatten(newQuery)
}

const transformResult = (result) =>
  result.body.hits.hits.map((match) => {
    return {
      index: match._index,
      id: match._id,
      score: match._score,
      createdAt: match._source.createdAt,
      agency: match._source.agency,
      organisationNumber: match._source.oganisationNumber
    }
  })

const makeQuery = ({ query, client }) =>
  client
    .search({
      index: ['regleringsbrev', 'arsredovisningar'],
      body: {
        query: {
          bool: {
            should: getQuery(query)
          }
        }
      }
    })
    .then((result) => transformResult(result))
    .catch((error) => error)

module.exports = {
  makeQuery
}
