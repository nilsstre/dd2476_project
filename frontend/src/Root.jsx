import React from 'react'
import Search from './Search/Components/SearchPage.jsx'
import { Provider } from 'react-redux'

const Root = ({ store }) => (
  <Provider store={store}>
    <Search />
  </Provider>
)

export default Root
