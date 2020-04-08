const express = require('express')
const routs = express.Router()
const elastic = require('./elastic')

routs.use('/elastic', elastic)

module.exports = routs