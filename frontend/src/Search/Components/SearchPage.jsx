import React, { useEffect } from 'react'
import SearchForm from '../../general/components/SearchForm.jsx'
import { getFieldData, pingElastic, search } from '../actions'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import SearchTable from '../../general/components/SearchTable.jsx'
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'

const { useState } = require('react')

const useStyles = makeStyles((theme) => ({
  root: {
    height: '90vh',
    margin: 0,
    padding: 0
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '80vh'
  }
}))

const SearchPage = ({
  result,
  loading,
  agencyOrganisationNumber,
  years,
  loadingFieldData,
  search,
  getFieldData,
  setupFailed
}) => {
  const classes = useStyles
  const [state, setState] = useState({
    elasticConnected: false,
    snackbarOpen: false
  })

  useEffect(() => {
    getFieldData()
    pingElastic().then((result) =>
      setState({ elasticConnected: result, snackbarOpen: true })
    )
  }, [])

  useEffect(() => {
    const  interval = setInterval(() => setupFailed && getFieldData(), 3000)
    return () => clearInterval(interval)
  }, [])

  const handleClose = () => setState({ ...state, snackbarOpen: false })

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography component='h1' variant='h2' style={{ paddingLeft: '2px' }}>
          DD2476 Swedish Democracy Search
        </Typography>
        <LoadingOverlay
          active={loadingFieldData}
          spinner={<BounceLoader active={loadingFieldData} />}
        >
          <SearchForm
            onSubmit={search}
            agencyOrganisationNumber={agencyOrganisationNumber}
            years={years}
          />
          <SearchTable result={result} loading={loading} />
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={6000}
            onClose={handleClose}
            open={state.snackbarOpen}
          >
            <Alert
              onClose={handleClose}
              severity={state.elasticConnected ? 'success' : 'error'}
            >
              {state.elasticConnected
                ? 'Connected to Elastic'
                : 'Failed to connect to Elastic'}
            </Alert>
          </Snackbar>
        </LoadingOverlay>
      </Paper>
    </div>
  )
}

export default connect(
  (state) => ({
    result: state.search.get('result'),
    loading: state.search.get('loading'),
    loadingFieldData: state.search.get('loadingFieldData'),
    years: state.search.get('years'),
    agencyOrganisationNumber: state.search.get('agencyOrganisationNumber'),
    setupFailed: state.search.get('setupFailed')
  }),
  { search, getFieldData }
)(SearchPage)
