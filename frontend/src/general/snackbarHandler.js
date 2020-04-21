export const SNACKBAR_TYPES = {
  ELASTIC_CONNECTION_SUCCESS: {
    message: 'Successfully connected to Elastic',
    variant: 'success'
  },
  ELASTIC_FAILURE: {
    message: 'Failed to connect to Elastic',
    variant: 'error'
  },
  SETUP_FAILURE: {
    message: 'Failed to retrieve field data, please refresh site',
    variant: 'error'
  },
  SEARCH_RESULT: (matches) => ({
    message: `Found ${matches} matching documents`,
    variant: 'info'
  })
}

export const snackbarHandler = ({ type, enqueueSnackbar }) =>
  enqueueSnackbar(type.message, {
    variant: type.variant,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right'
    }
  })