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
    default:
      return state
  }
}
