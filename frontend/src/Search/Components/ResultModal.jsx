import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Paper from '@material-ui/core/Paper'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import DateTime from 'luxon/src/datetime'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'

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
  <Grid item style={{ width: '50%', padding: '4px' }}>
    <Paper style={{ padding: '2px' }}>
      <Typography component='h1' variant='h4'>
        {title}
      </Typography>
      <DialogContentText>{text}</DialogContentText>
    </Paper>
  </Grid>
)

const highlightPattern = ({ text, pattern = '' }) => {
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

const ResultModal = ({ open, handleClose, element, textQuery }) => {
  const classes = useStyles()

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
      </Paper>
      <DialogContent dividers={true}>
        <Grid container justify='center' style={{ flexWrap: 'nowrap' }}>
          <TextItem
            text={highlightPattern({
              text: element.get('goal'),
              pattern: textQuery
            })}
            title={'Mål'}
          />
          <TextItem
            text={highlightPattern({
              text: element.get('result'),
              pattern: textQuery
            })}
            title={'Result'}
          />
        </Grid>
      </DialogContent>
      <div className={classes.root}>
        <ButtonGroup>
          <Button>Download regleringsbrev</Button>
          <Button>Download regleringsbrev & årsredovsning</Button>
          <Button>Download årsredovsning</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  ) : null
}

export default ResultModal
