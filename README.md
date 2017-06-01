# GarageDoor
Proof of concept to open a garage door with a raspberry Pi and a relay.

Since the relay I had required more current than a single GPIO pin could provide, I switch 2 together and dump them into the same pin.

# Instructions
To install:

1. Connect a relay to physical pins 29/31 or broadcom 5/6.

2. Clone to a location somewhere and `npm install`

3. run `sudo node server.js` (must run as root, GPIO libraries require it for now, yuk!)

4. From a browser navigate to `http://<ip address/button` and the relay should click (on) pause ~500ms and click again (off)

5. ???

6. Profit

# Future
I might class this up one day, definitely add authentication and TLS... Maybe switch it to MQTT???

# Notes
* `index.js` is just a standalone app that pulses the relay for 500ms and exits.
* If you CTRL-C the script, it should set the pin outputs to false and gracefully release the GPIO. In theory if an exception happens it should do the same...