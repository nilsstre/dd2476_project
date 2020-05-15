import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import { Field, reduxForm } from 'redux-form'
import { renderSelectField } from '../../general/Components/FormFields.jsx'
import Button from '@material-ui/core/Button'
import DialogContentText from '@material-ui/core/DialogContentText'

const FORM_NAME = 'settingsForm'

const boostOptions = ({ size, startAt = 0 }) => [
  { name: 'Default', value: '' },
  ...[...Array(size).keys()]
    .map((key) => key + startAt)
    .map((key) => ({ name: key, value: key }))
]

const resultSize = [10, 20, 50, 100, 150, 200].map((key) => ({
  name: key,
  value: key
}))

const SettingsModal = ({ open, handleClose, handleSubmit, submitting }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth={true} >
      <DialogTitle>Search preferences</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Changes will take effect on next search
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <Typography variant='h6' component='h6'>
            Boost search fields
          </Typography>
          <div style={{ display: 'flex', width: '100%', paddingBottom: '1em' }}>
            <Field
              name='boostGoalsAndReporting'
              component={renderSelectField}
              menuItems={boostOptions({ size: 5, startAt: 2 })}
              label='Boost goals and reporting'
            />
            <Field
              name='boostObjectives'
              component={renderSelectField}
              menuItems={boostOptions({ size: 5, startAt: 2 })}
              label='Boost objectives'
            />
          </div>
          <Typography variant='h6' component='h6'>
            Set maximum number of search result
          </Typography>
          <div style={{ display: 'flex', width: '100%', paddingBottom: '1em' }}>
            <Field
              name='resultSize'
              component={renderSelectField}
              menuItems={resultSize}
              label='Maximum number of search result'
            />
          </div>
          <div
            style={{
              display: 'flex',
              paddingTop: '10px',
              paddingBottom: '1em'
            }}
          >
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleClose}
              disabled={submitting}
              style={{ marginRight: '2em', marginLeft: 'auto' }}
            >
              Cancel
            </Button>
            <Button
              variant='outlined'
              color='primary'
              type='submit'
              disabled={submitting}
              style={{ float: 'right' }}
            >
              Save settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default reduxForm({ form: FORM_NAME })(SettingsModal)
