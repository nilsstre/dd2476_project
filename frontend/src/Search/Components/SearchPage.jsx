import React, { useEffect } from 'react'
import SearchForm from '../../general/components/SearchForm.jsx'
import { getFieldData, search } from '../actions'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import SearchTable from '../../general/components/SearchTable.jsx'
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import Typography from '@material-ui/core/Typography'
import { keyframes } from '@emotion/core'

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
  },
  textAnimation: {

  }
}))

const SearchPage = ({
  result,
  loading,
  agencyOrganisationNumber,
  years,
  loadingFieldData,
  search,
  getFieldData
}) => {
  const classes = useStyles

  useEffect(() => {
    getFieldData()
  }, [])

  return (
    <div className={classes.root} >
      <Paper className={classes.paper}>
        <Typography component="h1" variant='h2' style={{ paddingLeft: '2px'}}>
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
    agencyOrganisationNumber: state.search.get('agencyOrganisationNumber')
  }),
  { search, getFieldData }
)(SearchPage)
