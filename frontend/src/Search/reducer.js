import { fromJS, Map } from 'immutable'
import * as actions from './actions'

export default (state = Map(), action) => {
  switch (action.type) {
    case actions.SEARCH_FAILURE:
      return state.set('failure', true)
    case actions.SEARCH_LOADING:
      return state.set('loading', true)
    case actions.SEARCH_SUCCESS:
      state = state.set('loading', false)
      return state.set('result', fromJS(action.result.data))
    case actions.SETUP_SUCCESS:
      return state.set('fieldData', fromJS({
        agencies: action.result.data.agencies,
        organisationNumbers: action.result.data.organisationNumber,
        years: action.result.data.years
      }))
    case actions.SETUP_FAILURE:
      return state.set('setupFailed', true)
    case actions.UPDATE_QUERY_SETTINGS:
      return state.set('querySettings', fromJS(action.result))
    case actions.SETUP_LOADING:
    default:
      return state
  }
}
