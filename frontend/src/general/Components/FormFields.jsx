import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

export const renderAutoComplete = ({
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

export const renderTextField = ({ input, label, hintText, meta, ...rest }) => (
  <TextField
    label={label}
    {...input}
    {...rest}
    style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis: 600 }}
  />
)

export const renderSelectField = ({ input, label, menuItems, ...custom }) => (
  <TextField
    style={{ margin: '0 0.5em 0 0.5em', display: 'flex', flexBasis: 400 }}
    variant='outlined'
    label={label}
    {...input}
    {...custom}
    select
  >
    {menuItems.map((menuItem) => (
      <MenuItem key={menuItem.name} value={menuItem.value}>
        {menuItem.name}
      </MenuItem>
    ))}
  </TextField>
)
