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
    case actions.SETUP_LOADING:
      return state.set('loadingFieldData', true)
    case actions.SETUP_SUCCESS:
      state = state.set('loadingFieldData', false)
      state = state.set('setupFailed', false)
      state = state.set('years', fromJS(action.result.data.years))
      return state.set('agencyOrganisationNumber', fromJS(action.result.data.agencyOrganisationNumber))
    case actions.SETUP_FAILURE:
      return state.set('setupFailed', true)
    default:
      return state
  }
}
