import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Paper from '@material-ui/core/Paper'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import DateTime from 'luxon/src/datetime'
import { makeStyles } from '@material-ui/core/styles'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import { getPathToPDF } from '../../general/helpers'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  paper: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16)
    }
  }
}))

const TextItem = ({ text, title }) => (
  <Grid item >
    <Paper style={{ padding: '2px' }}>
      <Typography component='h1' variant='h4'>
        {title}
      </Typography>
      <DialogContentText>{text}</DialogContentText>
    </Paper>
  </Grid>
)

const highlightPattern = ({ text = '', pattern = '' }) => {
  const splitText = text.split(pattern)

  if (splitText.length <= 1) {
    return text
  }

  const matches = text.match(pattern)

  return splitText.reduce(
    (arr, element, index) =>
      matches[index]
        ? [...arr, element, <mark>{matches[index]}</mark>]
        : [...arr, element],
    []
  )
}

const PDFhighlightPattern = (text, pattern) => {
  const splitText = text.split(pattern);

  if (splitText.length <= 1) {
    return text;
  }

  const matches = text.match(pattern);

  return splitText.reduce((arr, element, index) => (matches[index] ? [
    ...arr,
    element,
    <mark>
      {matches[index]}
    </mark>,
  ] : [...arr, element]), []);
}

const makeTextRenderer = (searchText) => (textItem) => PDFhighlightPattern(textItem.str, searchText)

const PDFView = ({ element, onLoadSuccess, state, searchText }) => (<div>
  <Document
    file={getPathToPDF(element.get('year') + '_' + element.get('agency') + '_' + element.get('organisationNumber').replace('-', '') + '.pdf')}
    onLoadSuccess={onLoadSuccess}
  >
    {Array.from(new Array(state.numPages), (el, index) => (
      <Page key={`page_${index + 1}`} pageNumber={index + 1} customTextRenderer={makeTextRenderer(searchText)}/>
    ))}
  </Document>
  <p>
    Page {state.pageNumber} of {state.numPages}
  </p>
</div>)

const ResultModal = ({ open, handleClose, element, textQuery }) => {
  const [state, setState] = useState({
    numPages: null,
    pageNumber: 1
  })

  const onLoadSuccess = ({ numPages }) => setState({ ...state, numPages })

  return element ? (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xl'
      scroll={'paper'}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle>{element.get('agency')}</DialogTitle>
      <Paper style={{ padding: '2px' }}>
        <ul>
          <li>{`Organisation number: ${element.get('organisationNumber')}`}</li>
          <li>{`Year: ${DateTime.fromISO(element.get('year')).year}`}</li>
        </ul>
¨      </Paper>
      <DialogContent dividers={true}>
        <Grid container justify='center' direction="row" style={{ flexWrap: 'nowrap' }}>
          <div style={{ width: '30%', alignItems: 'left' }}>
            <TextItem
              text={highlightPattern({
                text: element.get('goalsAndReporting'),
                pattern: textQuery
              })}
              title={'Goals and reporting'}
            />
            <TextItem text={highlightPattern({
              text: element.get('objective'),
              pattern: textQuery
            })}
            title={'Objective'}/>
          </div>
          <PDFView element={element} onLoadSuccess={onLoadSuccess} state={state} searchText={textQuery} />
        </Grid>
      </DialogContent>
    </Dialog>
  ) : null
}

export default ResultModal
