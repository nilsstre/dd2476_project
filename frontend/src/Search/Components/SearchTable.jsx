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
import {
  useCountSearchResult,
  useGetResult,
  useGetTextQuery
} from '../../hooks'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}))

const rowDescriptions = [
  { id: 'agency', numeric: false, label: 'Agency' },
  { id: 'organisationNumber', numeric: false, label: 'Organisation number' },
  { id: 'year', numeric: true, label: 'Year' },
  { id: 'score', numeric: true, label: 'Score' }
]

const descendingComparator = (a, b, orderBy) => {
  if (b.get(orderBy) < a.get(orderBy)) {
    return -1
  }
  if (b.get(orderBy) > a.get(orderBy)) {
    return 1
  }
  return 0
}

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
  return array.sort((a, b) => comparator(a, b))
}

const getKey = (key, number) => `${key}-${number}`

const TableElement = ({ element, handleClick, keyValue }) => (
  <TableRow onClick={() => handleClick(element)} key={getKey(keyValue)}>
    <TableCell key={getKey(keyValue, 1)} align='left'>{element.get('agency')}</TableCell>
    <TableCell key={getKey(keyValue, 2)} align='left'>
      {element.get('organisationNumber')
        ? element.get('organisationNumber')
        : 'Missing'}
    </TableCell>
    <TableCell key={getKey(keyValue, 3)} align='right'>
      {DateTime.fromISO(element.get('year')).year}
    </TableCell>
    <TableCell key={getKey(keyValue, 4)} align='right'>
      {Math.round((element.get('score') + Number.EPSILON) * 100) / 100}
    </TableCell>
  </TableRow>
)

const EnhancedTableHead = ({ order, orderBy, onRequestSort, classes }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {rowDescriptions.map((rowDescription) => (
          <TableCell
            key={rowDescription.id}
            align={rowDescription.numeric ? 'right' : 'left'}
          >
            <TableSortLabel
              key={rowDescription.label}
              active={orderBy === rowDescription.id}
              direction={orderBy === rowDescription.id ? order : 'asc'}
              onClick={createSortHandler(rowDescription.id)}
            >
              <b>{rowDescription.label}</b>
              {orderBy === rowDescription.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const SearchTable = ({ loading }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedElement, setSelectedElement] = useState()
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('score')

  const { enqueueSnackbar } = useSnackbar()

  const classes = useStyles()

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

  const handleClick = (element) => {
    setSelectedElement(element)
    setModalOpen(true)
  }

  const handleResultModalClose = () => setModalOpen(false)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    console.log(property)
    setOrderBy(property)
  }

  return (
    <React.Fragment>
      <LoadingOverlay active={loading} spinner={<ClipLoader loading={true} />}>
        <ResultModal
          open={modalOpen}
          handleClose={handleResultModalClose}
          element={selectedElement}
          textQuery={textQuery}
        />
        <TableContainer>
          <Table stickyHeader aria-label='sticky table' unselectable='off'>
            <EnhancedTableHead
              onRequestSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
              classes={classes}
            />
            <TableBody>
              {result
                ? stableSort(result, getComparator(order, orderBy)).map(
                    (element, index) => (
                      <TableElement
                        key={index}
                        element={element}
                        handleClick={() => handleClick(element)}
                        keyValue={index}
                      />
                    )
                  )
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </LoadingOverlay>
    </React.Fragment>
  )
}

export default SearchTable
