const getSearchObject = (request) => {
  const {
    querySettings: { resultSize }
  } = request

  return {
    index: ['appropriation-directions'],
    body: {
      query: {
        bool: {
          must: {
            multi_match: getQuery(request)
          },
          filter: getFilters(request)
        }
      }
    },
    size: resultSize ? resultSize : 10
  }
}

const getQuery = (request) => {
  const {
    query: { textQuery },
    querySettings: { queryType, boostGoalsAndReporting, boostObjectives }
  } = request

  let fields = ['goals_and_reporting', 'objective']

  if (boostGoalsAndReporting) {
    fields = [fields[0] + `^${boostGoalsAndReporting}`, fields[1]]
  }

  if (boostObjectives) {
    fields = [fields[0], fields[1] + `^${boostObjectives}`]
  }

  return {
    query: textQuery,
    type: queryType || 'phrase',
    fields
  }
}

const getFilters = (request) => {
  const {
    query: { agencies, organisationNumbers, years }
  } = request

  let filters = []

  if (agencies && agencies.length > 0) {
    filters = [...filters, { terms: { agency: agencies } }]
  }

  if (organisationNumbers && organisationNumbers.length > 0) {
    filters = [
      ...filters,
      {
        terms: { organization_number: organisationNumbers }
      }
    ]
  }

  if (years && years.length > 0) {
    filters = [...filters, { terms: { year: years } }]
  }

  return filters
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
