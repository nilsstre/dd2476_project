const express = require('express')
const app = express()
const body_parser = require('body-parser')
const PORT = process.env.PORT || 5000
const api = require('./api/')

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

app.use((rec, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use("/api", api)

app.listen(PORT, () => console.log(`Running server on port ${PORT}`))
