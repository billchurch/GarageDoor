// index.js
// standalone app that pulses pins 29/31 to true, waits 500ms then back to false.

var gpio = require('rpi-gpio')
var async = require('async')
var pulseDelay = 500
var relayPins = [29, 31]

// setup pins
async.each(relayPins, function (pin, callback) {
  gpio.setup(pin, gpio.DIR_OUT, callback)
  console.log('Pin: ' + pin + ' gpio.DIR_OUT')
}, function (err, results) {
  if (err) console.log(err.stack)
  console.log('Pins set up, button ready.')
})

// press the button
buttonPress()

// cleanup
gpio.destroy()

// functions

function buttonPress () {
  console.log('buttonPress')
  async.each(relayPins, function (pin, callback) {
    write(pin, true)
    delayedWrite(pin, false, pulseDelay)
    console.log('buttonPress each ' + pin)
    callback()
  })
}

function write (pin, value, callback) {
  setTimeout(function () {
    gpio.write(pin, value, callback)
    console.log('Write: ' + pin + ' value: ' + value)
  })
}

function delayedWrite (pin, value, callback) {
  setTimeout(function () {
    gpio.write(pin, value, callback)
    console.log('Write: ' + pin + ' value: ' + value)
  }, 500)
}
