import React, { useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PreviewModal from './PreviewModal.jsx'
import { DateTime } from 'luxon'
import LoadingOverlay from 'react-loading-overlay'
import ClipLoader from 'react-spinners/ClipLoader'

const rowDescriptions = [
  'Agency',
  'Organisation number',
  'Year',
  'Score',
  'Type'
]

const getKey = (key, number) => `${key}-${number}`

const TableElement = ({ element, handleClick, keyValue }) => (
  <TableRow onClick={() => handleClick(element)} key={getKey(keyValue, 0)}>
    <TableCell key={getKey(keyValue, 1)}>{element.get('agency')}</TableCell>
    <TableCell key={getKey(keyValue, 2)}>
      {element.get('organisationNumber') === '_missing_' ? 'Missing' : element.get('organisationNumber')}
    </TableCell>
    <TableCell key={getKey(keyValue, 3)}>
      {DateTime.fromISO(element.get('createdAt')).year}
    </TableCell>
    <TableCell key={getKey(keyValue, 4)}>{element.get('score')}</TableCell>
    <TableCell key={getKey(keyValue, 5)}>{element.get('index')}</TableCell>
  </TableRow>
)

const SearchTable = ({ result, loading }) => {
  const [isOpen, setOpen] = useState(false)
  const [getSelectedElement, setSelectedElement] = useState()

  const handleClick = (element) => {
    setOpen(true)
    setSelectedElement(element)
  }

  const handleClose = () => setOpen(false)

  return (
    <React.Fragment>
      <LoadingOverlay active={loading} spinner={<ClipLoader loading={true}/>} >
        <TableContainer>
          <Table unselectable={'off'}>
            <TableHead>
              <TableRow>
                {rowDescriptions.map((description, index) => (
                  <TableCell key={index}>{description} </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <PreviewModal
                open={isOpen}
                element={getSelectedElement}
                handleClose={handleClose}
              />
              {result
                ? result.map((element, key) => (
                  <TableElement
                    key={key}
                    keyValue={key}
                    element={element}
                    handleClick={handleClick}
                  />
                ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </LoadingOverlay>
    </React.Fragment>
  )
}

export default SearchTable
