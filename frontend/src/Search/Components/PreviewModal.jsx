import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import PDFView from '../../general/components/PDFPview.jsx'
import DialogContent from '@material-ui/core/DialogContent'

const PreviewModal = ({ element, open, handleClose }) => {
  return element ? (
    <Dialog open={open} onClose={handleClose} scroll={'paper'}>
      <DialogTitle>{element.get('agency')}</DialogTitle>
      <DialogContent>
        <PDFView
          element={element}
        />
      </DialogContent>
    </Dialog>
  ) : null
}

export default PreviewModal
