import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import {
  getAgencies,
  getOrganisationNumbers,
  getYears
} from '../../general/helpers'
import { useGetFieldData, useGetTextQuery } from '../../hooks'
import SettingsIcon from '@material-ui/icons/Settings'
import {
  renderAutoComplete,
  renderTextField
} from '../../general/Components/FormFields.jsx'

export const FORM_NAME = 'searchForm'

const SearchForm = ({ handleSubmit, submitting, pristine, settingsOpen }) => {
  const fieldData = useGetFieldData()
  const isTextQuery = !!!useGetTextQuery()

  return (
    <form
      style={{ display: 'flex', margin: '10 2 2 2 em' }}
      onSubmit={handleSubmit}
    >
      <div style={{ display: 'flex', width: '100%', bottom: '2em' }}>
        <Field name='textQuery' component={renderTextField} label='Search' />
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
        <Button type='submit' disabled={submitting || pristine || isTextQuery}>
          <SearchIcon />
        </Button>
        <Button onClick={settingsOpen} disabled={submitting}>
          <SettingsIcon />
        </Button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: FORM_NAME
})(SearchForm)
