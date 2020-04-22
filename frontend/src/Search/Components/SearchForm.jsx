import React from 'react'
import { Field, reduxForm } from 'redux-form'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  getAgencies,
  getOrganisationNumbers,
  getYears
} from '../../general/helpers'
import { useGetFieldData } from '../../hooks'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

export const FORM_NAME = 'searchForm'

const renderTextField = ({ input, label, hintText, meta, ...rest }) => (
  <TextField
    style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis: 600 }}
    label={label}
    {...input}
    {...rest}
  />
)

const renderAutoComplete = ({
  options,
  label,
  placeholder,
  input,
  flexBasis,
  ...rest
}) => {
  return (
    <Autocomplete
      style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis }}
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

const renderSelectField = ({ input, label, ...custom }) => (
  <TextField
    style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis: 400 }}
    variant='outlined'
    label={label}
    {...input}
    {...custom}
    select
  >
    <MenuItem value='both'>Both</MenuItem>
    <MenuItem value='goals_and_reporting'>Goals and reporting</MenuItem>
    <MenuItem value='objective'>Objective</MenuItem>
  </TextField>
)

const SearchForm = ({ handleSubmit, submitting }) => {
  const fieldData = useGetFieldData()

  return (
    <form
      style={{ display: 'flex', margin: '10 2 2 2 em' }}
      onSubmit={handleSubmit}
    >
      <div style={{ display: 'flex', width: '100%', bottom: '2em' }}>
        <Field
          name='searchField'
          component={renderTextField}
          label='Free text search'
        />
        <Field
          name='selectTextField'
          component={renderSelectField}
          label='Select text field'
          placeholder='Text field'
        />
        <Field
          name='selectAgency'
          component={renderAutoComplete}
          options={getAgencies(fieldData.get('agencies'))}
          label='Select agencies'
          placeholder='Agencies'
          flexBasis={600}
        />
        <Field
          name='selectOrganisationNumber'
          component={renderAutoComplete}
          options={getOrganisationNumbers(fieldData.get('organisationNumbers'))}
          label='Select organisation numbers'
          placeholder='Organisation number'
          flexBasis={400}
        />
        <Field
          name='selectYear'
          component={renderAutoComplete}
          options={getYears(fieldData.get('years'))}
          label='Select years'
          placeholder='Years'
          flexBasis={300}
        />
        <Button type='submit' disabled={submitting}>
          <SearchIcon />
        </Button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: FORM_NAME
})(SearchForm)
