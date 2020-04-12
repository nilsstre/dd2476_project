import React, { useState } from 'react'
import { Field, reduxForm, submit } from 'redux-form'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { getAgencies, getOrganisationNumbers, getYear } from '../../general/helpers'

const FORM_NAME = 'searchForm'

const renderTextField = ({ input, label, hintText, meta, ...rest }) => (
  <TextField
    style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis: 600 }}
    label={label}
    {...input}
    {...rest}
  />
)

const renderAutoComplete = ({ options, label, placeholder, input, ...rest }) => {
  return (
    <Autocomplete
      style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis: 600 }}
      multiple
      id='selectAgency'
      options={options}
      onChange={(_, value) => input.onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label={label}
          placeholder={placeholder}
        />
      )}
      {...rest}
    />
  )
}

const SearchForm = ({ handleSubmit, submitting }) => {
  return (
    <form style={{ display: 'flex', margin: '2 2 2 2 em' }} onSubmit={handleSubmit}>
      <div style={{ display: 'flex', width: '100%', bottom: '2em'}}>
        <Field name='searchField' component={renderTextField} label='Free text search' />
        <Field name='selectAgency' component={renderAutoComplete} options={getAgencies()} label='Select agencies' placeholder='Agencies' />
        <Field name='selectOrganisationNumber' component={renderAutoComplete} options={getOrganisationNumbers()} label='Select organisation numbers' placeholder='Organisation number' />
        <Field name='selectYear' component={renderAutoComplete} options={getYear()} label='Select year' placeholder='Year' />
        <Button type='submit' disabled={submitting} >
          <SearchIcon />
        </Button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: FORM_NAME
})(SearchForm)
