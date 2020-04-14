const express = require('express')
const routs = express.Router()
const elastic = require('./elastic')
const setup = require('./setup')

routs.use('/elastic', elastic)
routs.use('/setup', setup)

module.exports = routs