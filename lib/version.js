var HID = require('node-blink1/node_modules/node-hid');

var VENDOR_ID = 0x27B8;
var PRODUCT_ID = 0x01ED;

var _blink1HIDdevices = function() {
  return HID.devices(VENDOR_ID, PRODUCT_ID);
};

var devices = function() {
  var serialNumbers = [];

  _blink1HIDdevices().forEach(function(device) {
    serialNumbers.push(device.serialNumber);
  });

  return serialNumbers;
};

function Blink1(serialNumber) {
  var blink1HIDdevices = _blink1HIDdevices();

  if (blink1HIDdevices.length === 0) {
    throw new Error('No blink(1)\'s could be found');
  }

  var blink1HIDdevicePath = null;

  if (serialNumber === undefined) {
    serialNumber =  blink1HIDdevices[0].serialNumber;
  }

  blink1HIDdevices.some(function(blink1HIDdevice) {
    if (serialNumber === blink1HIDdevice.serialNumber) {
      blink1HIDdevicePath = blink1HIDdevice.path;
    }

    return (blink1HIDdevicePath !== null);
  });

  if (blink1HIDdevicePath === null) {
    throw new Error('No blink(1)\'s with serial number ' + serialNumber + ' could be found');
  }

  this.serialNumber = serialNumber;
  this.hidDevice = new HID.HID(blink1HIDdevicePath);
}

Blink1.devices = devices;

module.exports = Blink1;
module.exports.Blink1 = Blink1; // backwards compatibility with older version
