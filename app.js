// app.js
var express = require('express')
var app = express()

var UserController = require('./button/buttonController')
app.use('/button', UserController)
module.exports = app
