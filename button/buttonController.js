// buttonController.js
// make sure we resume if get an exception or ctrl-c, helps us
// clean up our pins...
process.stdin.resume()
var pulseDelay = 500
var debug = require('debug')('button')
var express = require('express')
var router = express.Router()
var gpio = require('rpi-gpio')
var async = require('async')
var relayPins = [29, 31]

module.exports = router

// setup pins
async.each(relayPins, function (pin, callback) {
  gpio.setup(pin, gpio.DIR_OUT, callback)
  debug('Pin: ' + pin + ' gpio.DIR_OUT')
}, function (err, results) {
  if (err) console.log(err.stack)
  debug('Pins set up, button ready.')
})

// PRESSES THE BUTTON
router.get('/', function (req, res) {
  buttonPress(req, res)
  res.status(200).send('Button Pressed by: ' + req.client.remoteAddress)
  console.log('Button Pressed by: ' + req.client.remoteAddress)
})

function buttonPress (req, res) {
  debug('buttonPress')
  async.each(relayPins, function (pin, callback) {
    write(pin, true)
    delayedWrite(pin, false, pulseDelay)
    debug('buttonPress each ' + pin)
    callback()
  })
}

function write (pin, value) {
  setTimeout(function () {
    gpio.write(pin, value)
    debug('write: pin ' + pin + ' value ' + value)
  })
}

function delayedWrite (pin, value, delay) {
  setTimeout(function () {
    gpio.write(pin, value)
    debug('delayedWrite: pin ' + pin + ' value ' + value + ' delay ' + delay)
  }, delay)
}

// if we have an exception, or someone terminates the app we want to turn the pins off
// and release the GPIO hooks.
function exitHandler (options, err) {
  debug('exitHandler')
  async.each(relayPins, function (pin, callback) {
    debug('exitHandler - each loop ' + pin)
    write(pin, false, callback)
  })
  gpio.destroy(function () {
    if (options.cleanup) console.log('clean')
    if (err) console.log(err.stack)
    if (options.exit) process.exit()
  })
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}))

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}))

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}))
