import React, { useEffect, useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { DateTime } from 'luxon'
import LoadingOverlay from 'react-loading-overlay'
import ClipLoader from 'react-spinners/ClipLoader'
import ResultModal from './ResultModal.jsx'
import { useSnackbar } from 'notistack'
import { SNACKBAR_TYPES, snackbarHandler } from '../../general/snackbarHandler'
import { sortElements } from '../../general/helpers'
import {
  useCountSearchResult,
  useGetResult,
  useGetTextQuery
} from '../../hooks'

const rowDescriptions = [
  'Agency',
  'Organisation number',
  'Year',
  'Score'
]

const getKey = (key, number) => `${key}-${number}`

const TableElement = ({ element, handleClick, keyValue }) => (
  <TableRow onClick={() => handleClick(element)} key={getKey(keyValue)}>
    <TableCell key={getKey(keyValue, 1)}>{element.get('agency')}</TableCell>
    <TableCell key={getKey(keyValue, 2)}>
      {element.get('organisationNumber')
        ? element.get('organisationNumber')
        : 'Missing'}
    </TableCell>
    <TableCell key={getKey(keyValue, 3)}>
      {DateTime.fromISO(element.get('year')).year}
    </TableCell>
    <TableCell key={getKey(keyValue, 4)}>{element.get('score')}</TableCell>
  </TableRow>
)

const SearchTable = ({ loading }) => {
  const [state, setState] = useState({ modalOpen: false, filterType: 'Agency' })

  const { enqueueSnackbar } = useSnackbar()

  const result = useGetResult()
  const textQuery = useGetTextQuery()
  const resultCount = useCountSearchResult()

  useEffect(() => {
    !loading &&
      !!result &&
      snackbarHandler({
        type: SNACKBAR_TYPES.SEARCH_RESULT(resultCount),
        enqueueSnackbar
      })
  }, [result])

  const handleClick = (element) =>
    setState({ ...state, modalOpen: true, element })

  const handleResultModalClose = () => setState({ ...state, modalOpen: false })

  return (
    <React.Fragment>
      <LoadingOverlay active={loading} spinner={<ClipLoader loading={true} />}>
        <ResultModal
          open={state.modalOpen}
          handleClose={handleResultModalClose}
          element={state.element}
          textQuery={textQuery}
        />
        <TableContainer>
          <Table unselectable={'off'}>
            <TableHead>
              <TableRow>
                {rowDescriptions.map((description, index) => (
                  <TableCell
                    key={index}
                    onClick={() =>
                      setState({ ...state, filterType: description })
                    }
                  >
                    {description}{' '}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result
                ? result
                    .sort((firstElement, secondElement) =>
                      sortElements({
                        firstElement,
                        secondElement,
                        filterType: state.filterType
                      })
                    )
                    .map((element, key) => (
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
