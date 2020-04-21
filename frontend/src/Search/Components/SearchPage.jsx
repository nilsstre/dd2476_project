import React, { useEffect } from 'react'
import SearchForm from './SearchForm.jsx'
import { getFieldData, pingElastic, search } from '../actions'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import SearchTable from './SearchTable.jsx'
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import Typography from '@material-ui/core/Typography'
import { useSnackbar } from 'notistack'
import {
  useGetLoading,
  useGetLoadingFieldData,
  useGetSetupFailed
} from '../../hooks'
import { SNACKBAR_TYPES, snackbarHandler } from '../../general/snackbarHandler'
import * as actions from '../actions'

const useStyles = makeStyles(() => ({
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

const handleSetup = ({ result, enqueueSnackbar }) => {
  if (result.type === actions.SETUP_FAILURE) {
    snackbarHandler({
      type: SNACKBAR_TYPES.SETUP_FAILURE,
      enqueueSnackbar
    })
  }
}

const SearchPage = () => {
  const classes = useStyles

  const { enqueueSnackbar } = useSnackbar()

  const dispatch = useDispatch()

  const loading = useGetLoading()
  const loadingFieldData = useGetLoadingFieldData()
  const setupFailed = useGetSetupFailed()

  useEffect(() => {
    dispatch(getFieldData()).then((result) =>
      handleSetup({ result, enqueueSnackbar })
    )
    pingElastic().then((result) => {
      snackbarHandler({
        type: result
          ? SNACKBAR_TYPES.ELASTIC_CONNECTION_SUCCESS
          : SNACKBAR_TYPES.ELASTIC_FAILURE,
        enqueueSnackbar
      })
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(
      () =>
        setupFailed &&
        dispatch(getFieldData()).then((result) =>
          handleSetup({ result, enqueueSnackbar })
        ),
      3000
    )
    return () => clearInterval(interval)
  }, [])

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
          <SearchForm onSubmit={(result) => dispatch(search(result))} />
          <SearchTable loading={loading} />
        </LoadingOverlay>
      </Paper>
    </div>
  )
}

export default SearchPage
