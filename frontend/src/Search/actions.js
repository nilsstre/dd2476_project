import axios from 'axios'
import config from 'config'

const URL = config.backend_URL

export const SEARCH_LOADING = 'SEARCH_LOADING'
export const SEARCH_FAILURE = 'SEARCH_FAILURE'
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS'

export const search = (values) => (dispatch) => {
  const {
    searchField,
    selectAgency,
    selectOrganisationNumber,
    selectYear
  } = values
  dispatch({ type: SEARCH_LOADING })
  return axios
    .post(`${URL}/api/elastic/search`, {
      textQuery: searchField,
      agencies: selectAgency,
      organisationNumbers: selectOrganisationNumber,
      years: selectYear
    })
    .then((response) =>
      dispatch({ type: SEARCH_SUCCESS, result: response.data })
    )
    .catch((error) => {
      console.error(error)
      return dispatch({ type: SEARCH_FAILURE })
    })
}

export const SETUP_LOADING = 'SETUP_LOADING'
export const SETUP_FAILURE = 'SETUP_FAILURE'
export const SETUP_SUCCESS = 'SETUP_SUCCESS'

export const getFieldData = () => (dispatch) => {
  dispatch({ type: SETUP_LOADING })
  return axios
    .get(`${URL}/api/setup/getFieldData`)
    .then((response) =>
      dispatch({ type: SETUP_SUCCESS, result: response.data })
    )
    .catch((error) => {
      console.error(error)
      return dispatch({ type: SETUP_FAILURE })
    })
}
