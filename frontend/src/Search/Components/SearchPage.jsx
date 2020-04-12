import React from 'react'
import SearchForm from './SearchForm.jsx'
import { search } from '../actions'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import SearchTable from './SearchTable.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh'
  }
}))

const SearchPage = ({ result, loading, search }) => {
  const classes = useStyles

  return (
    <Paper className={classes.paper}>
      <SearchForm onSubmit={search} />
      <SearchTable result={result} loading={loading} />
    </Paper>
  )
}

export default connect(
  (state) => ({
    result: state.search.get('result'),
    loading: state.search.get('loading')
  }),
  { search }
)(SearchPage)
