import React from 'react'
import Search from './Search/Components/SearchPage.jsx'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'

const Root = ({ store }) => (
  <Provider store={store}>
    <SnackbarProvider maxSnack={3}>
      <Search />
    </SnackbarProvider>
  </Provider>
)

export default Root
