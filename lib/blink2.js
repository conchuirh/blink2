#! /usr/bin/env node

var program = require('commander'),
    Blink1  = require('node-blink1'),
    sleep   = require('sleep');

var blink1;
try {
  blink1 = new Blink1.Blink1();
} catch(err) {
  console.log("no blink1 devices found");
  if( !testmode ) process.exit(1);
}

Blink1.prototype.fadeToRGBN = function(fadeMillis, r, g, b, n, callback) {
  this._validateFadeMillis(fadeMillis);
  this._validateRGB(r, g, b);

  var dms = fadeMillis / 10;

  this._sendCommand('c', this.degamma(r), this.degamma(g), this.degamma(b), dms >> 8, dms % 0xff, n);

  if(this._isValidCallback(callback)) {
    setTimeout(callback, fadeMillis);
  }
};

program
  .version('0.1.0')

program
  .command('devices')
  .description('prints array of serial #s')
  .action(function(){
    console.log(Blink1.devices());
  });

program
  .command('fade <time> <r> <g> <b>')
  .description('fade to color in rgb over time milliseconds')
  .action(function(time, r, g, b){
    blink1.fadeToRGB(parseInt(time), parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('fadeN <time> <r> <g> <b> <n>')
  .description('fade for mk2  n = led number')
  .action(function(time, r, g, b, n){
    blink1.fadeToRGBN(parseInt(time), parseInt(r), parseInt(g), parseInt(b), parseInt(n));
  });

program
  .command('set <r> <g> <b>')
  .description('set color in rgb')
  .action(function(r, g, b){
    blink1.setRGB(parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('random')
  .description('random color')
  .action(function(){
    blink1.fadeToRGB(1000, Math.floor(Math.random() * 255),
     Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  });

program
  .command('random2')
  .description('random colors in both leds    mk2 only')
  .action(function(){
    blink1.fadeToRGBN(1000, Math.floor(Math.random() * 255),
     Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1);
    blink1.fadeToRGBN(1000, Math.floor(Math.random() * 255),
     Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 2);
  });

program
  .command('rainbow-time <time>')
  .description('rotate through colors over (time * 6) seconds')
  .action(function(time){
    var t = parseInt(time);
    blink1.setRGB(0,0,255);
    blink1.fadeToRGB(t * (1000), 0, 255, 255);
    sleep.sleep(t);
    blink1.fadeToRGB(t * (1000), 0, 255, 0);
    sleep.sleep(t);
    blink1.fadeToRGB(t * (1000), 255, 255, 0);
    sleep.sleep(t);
    blink1.fadeToRGB(t * (1000), 255, 0, 0);
    sleep.sleep(t);
    blink1.fadeToRGB(t * (1000), 255, 0, 255);
    sleep.sleep(t);
    blink1.fadeToRGB(t * (1000), 0, 0, 255);
  });

program
  .command('rainbow')
  .description('rotate through colors')
  .action(function(){
    for(var i = 0; i < 255; i++){
      blink1.fadeToRGB(100, 255, i, 0);
    }
    for(var i = 255; i > 0; i--){
      blink1.fadeToRGB(100, i, 255, 0);
    }
    for(var i = 0; i < 255; i++){
      blink1.fadeToRGB(100, 0, 255, i);
    }
    for(var i = 255; i > 0; i--){
      blink1.fadeToRGB(100, 0, i, 255);
    }
    for(var i = 0; i < 255; i++){
      blink1.fadeToRGB(100, i, 0, 255);
    }
    for(var i = 255; i > 0; i--){
      blink1.fadeToRGB(100, 255, 0, i);
    }
  });

program
  .command('here')
  .description('set color to green')
  .action(function(){
    blink1.fadeToRGB(100, 0, 255, 0);
  });

program
  .command('away')
  .description('set color to yellow')
  .action(function(){
    blink1.fadeToRGB(100, 255, 255, 0);
  });

program
  .command('busy')
  .description('set color to red')
  .action(function(){
    blink1.fadeToRGB(100, 255, 0, 0);
  });

program
  .command('light')
  .description('set color to bright white')
  .action(function(){
    blink1.fadeToRGB(100, 255, 255, 255);
  });

program
  .command('light-low')
  .description('set color to white')
  .action(function(){
    blink1.fadeToRGB(100, 150, 150, 150);
  });

program
  .command('worldcup')
  .description('')
  .action(function(){

  });

program.parse(process.argv);
