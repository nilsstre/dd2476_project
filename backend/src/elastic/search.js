const { DateTime } = require('luxon')
const R = require('ramda')

const getQuery = (query) => {
  const { textQuery, textField, agencies, organisationNumbers, years } = query
  let newQuery = []

  if (
    textQuery &&
    (textField === 'goals_and_reporting' || textField === 'both')
  ) {
    newQuery = [...newQuery, { match: { goals_and_reporting: textQuery } }]
  }

  if (textQuery && (textField === 'objective' || textField === 'both')) {
    newQuery = [...newQuery, { match: { objective: textQuery } }]
  }

  if (agencies) {
    newQuery = [
      ...newQuery,
      agencies.map((agency) => ({ match: { agency: agency } }))
    ]
  }

  if (organisationNumbers) {
    newQuery = [
      ...newQuery,
      organisationNumbers.map((organisationNumber) => ({
        match: { organization_number: organisationNumber }
      }))
    ]
  }

  if (years) {
    newQuery = [
      ...newQuery,
      years.map((year) => ({
        match: {
          year: DateTime.fromObject({ year }).toISO()
        }
      }))
    ]
  }

  return R.flatten(newQuery)
}

const transformResult = (result) =>
  result.body.hits.hits.map((match) => {
    return {
      agency: match._source.agency,
      agencyId: match._source.agency_id,
      goalsAndReporting: match._source.goals_and_reporting,
      id: match._id,
      index: match._index,
      objective: match._source.objective,
      organisationNumber: match._source.organization_number,
      score: match._score,
      sourceUrl: match._source.source_url,
      year: match._source.year
    }
  })

const makeQuery = ({ query, client }) =>
  client
    .search({
      index: ['regleringsbrev'],
      body: {
        query: {
          bool: {
            should: getQuery(query)
          }
        }
      },
      size: 20
    })
    .then((result) => transformResult(result))
    .catch((error) => error)

module.exports = {
  makeQuery
}
