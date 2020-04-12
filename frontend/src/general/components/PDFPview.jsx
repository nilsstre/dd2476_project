import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import config from 'config'
const S3_ADDRESS = config.S3_ADDRESS

const getPathToPDF = (element) =>
  element && `${S3_ADDRESS}${element.get('index')}/${element.get('id')}`

const PDFView = ({ element }) => {
  const [getNumPages, setNumPages] = useState()

  return (
    <Document
      file={getPathToPDF(element)}
      onLoadSuccess={(document) => setNumPages(document.numPages)}
    >
      {Array.from(new Array(getNumPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  )
}

export default PDFView
