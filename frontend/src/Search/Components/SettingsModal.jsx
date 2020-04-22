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

const fullTextQueryOptions = [
  { name: 'Match (default)', value: 'match' },
  { name: 'Match bool prefix', value: 'match_bool_prefix' },
  { name: 'Match phrase', value: 'match_phrase' },
  { name: 'Match phrase prefix', value: 'match_phrase_prefix' },
  { name: 'Common terms', value: 'common' },
  { name: 'Query string', value: 'query_string' },
  { name: 'Simple query string', value: 'simple_query_string' }
]

const resultSize = [10, 20, 50, 100, 150, 200].map((key) => ({
  name: key,
  value: key
}))

const SettingsModal = ({ open, handleClose, handleSubmit, submitting }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth={true}>
      <DialogTitle>Search preferences</DialogTitle>
      <DialogContent>
        <DialogContentText >
          Changes will take effect on next search
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <Typography variant='h6' component='h6'>
            Boost search fields
          </Typography>
          <div style={{ display: 'flex', width: '100%', bottom: '2em' }}>
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
            <Field
              name='boostAgencies'
              component={renderSelectField}
              menuItems={boostOptions({ size: 5, startAt: 2 })}
              label='Boost agencies'
            />
            <Field
              name='boostOrganisationNumbers'
              component={renderSelectField}
              menuItems={boostOptions({ size: 5, startAt: 2 })}
              label='Boost organisation numbers'
            />
            <Field
              name='boostYears'
              component={renderSelectField}
              menuItems={boostOptions({ size: 5, startAt: 2 })}
              label='Boost years'
            />
          </div>
          <Typography variant='h6' component='h6'>
            Full text query
          </Typography>
          <div style={{ display: 'flex', width: '100%', bottom: '2em' }}>
            <Field
              name='fullTextQueryGoalsAndReporting'
              component={renderSelectField}
              menuItems={fullTextQueryOptions}
              label='Search and reporting'
            />
            <Field
              name='fullTextObjectives'
              component={renderSelectField}
              menuItems={fullTextQueryOptions}
              label='Objectives'
            />
          </div>
          <Typography variant='h6' component='h6'>
            Set maximum number of search result
          </Typography>
          <div style={{ display: 'flex', width: '100%', bottom: '2em' }}>
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
              paddingTop: '10px'
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
