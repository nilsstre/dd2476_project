const { DateTime } = require('luxon')
const R = require('ramda')

const getFieldQuery = ({ field, queryType = 'match', query, boost = 1.0 }) => ({
  [queryType]: {
    [field]: {
      query,
      boost
    }
  }
})

const getSearchObject = (request) => {
  const {
    querySettings: { resultSize }
  } = request

  return {
    index: ['regleringsbrev'],
    body: {
      query: {
        bool: {
          should: getQuery(request)
        }
      }
    },
    size: resultSize ? resultSize : 10
  }
}
const getQuery = (request) => {
  const {
    query: {
      goalsAndReporting,
      objectives,
      agencies,
      organisationNumbers,
      years
    },
    querySettings: {
      fullTextQueryGoalsAndReporting,
      fullTextObjectives,
      boostGoalsAndReporting,
      boostObjectives,
      boostAgencies,
      boostOrganisationNumbers,
      boostYears
    }
  } = request

  console.log(request.querySettings)
  let newQuery = []

  if (goalsAndReporting) {
    newQuery = [
      ...newQuery,
      getFieldQuery({
        field: 'goals_and_reporting',
        boost: boostGoalsAndReporting,
        query: goalsAndReporting,
        queryType: fullTextQueryGoalsAndReporting
      })
    ]
  }

  if (objectives) {
    newQuery = [
      ...newQuery,
      getFieldQuery({
        field: 'objective',
        boost: boostObjectives,
        query: objectives,
        queryType: fullTextObjectives
      })
    ]
  }

  if (agencies) {
    newQuery = [
      ...newQuery,
      agencies.map((agency) =>
        getFieldQuery({ field: 'agency', boost: boostAgencies, query: agency })
      )
    ]
  }

  if (organisationNumbers) {
    newQuery = [
      ...newQuery,
      organisationNumbers.map((organisationNumber) =>
        getFieldQuery({
          field: 'organization_number',
          boost: boostOrganisationNumbers,
          query: organisationNumber
        })
      )
    ]
  }

  if (years) {
    newQuery = [
      ...newQuery,
      years.map((year) =>
        getFieldQuery({ field: 'year', boost: boostYears, query: year })
      )
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
    .search(getSearchObject(query))
    .then((result) => transformResult(result))
    .catch((error) => error)

module.exports = {
  makeQuery
}
