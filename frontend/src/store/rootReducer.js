import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import searchReducer from '../Search/reducer'

const reducers = {
  search: searchReducer,
  form: formReducer
}

export default combineReducers(reducers)
