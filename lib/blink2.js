#! /usr/bin/env node

var program = require('commander'),
    Blink1  = require('node-blink1');

var blink1;
try {
  blink1 = new Blink1.Blink1();
} catch(err) {
  console.log("no blink1 devices found");
  process.exit(1);
}

/********
code to update node-blink1 to support mk2
*******/

Blink1.prototype._validatePosition = function(position) {
  this._validateNumber(position, 'position', 0, 15);
};

Blink1.prototype.fadeToRGBN = function(fadeMillis, r, g, b, n, callback) {
  this._validateFadeMillis(fadeMillis);
  this._validateRGB(r, g, b);

  var dms = fadeMillis / 10;

  this._sendCommand('c', this.degamma(r), this.degamma(g), this.degamma(b), dms >> 8, dms % 0xff, n);

  if(this._isValidCallback(callback)) {
    setTimeout(callback, fadeMillis);
  }
};

Blink1.prototype.playLoop = function(startpos, endpos, count, callback){
  this._validatePosition(startpos);
  this._validatePosition(endpos);

  this._sendCommand('p', 1, startpos, endpos, count, 0, 0);
};

Blink1.prototype.readPlayState = function(callback) {
  this._sendCommand('S', 0, 0, 0, 0, 0, 0, 0);

  this._readResponse(function(response) {
    var value = {
      playing: response[2],
      playStart: response[3],
      playEnd: response[4],
      playCount: response[5],
      playPos: response[6]
    };

    if(this._isValidCallback(callback)) {
      callback(value);
    }
  });
};

Blink1.prototype.savePattern = function(callback) {
  this._sendCommand('W', 0xBE, 0xEF, 0xCA, 0xFE, 0x00, 0x00);

  if(this._isValidCallback(callback)) {
    callback();
  }
};

/*******
end mk2 compatiblity code
*******/

program
  .version('0.1.8')

program
  .command('devices')
  .description('prints array of serial #s')
  .action(function(){
    console.log(Blink1.devices());
  });

program
  .command('fade <time> <r> <g> <b>')
  .description('fade to color in rgb over time in seconds')
  .action(function(time, r, g, b){
    blink1.fadeToRGB((parseInt(time) * 1000), parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('fadeN <time> <r> <g> <b> <ledn>')
  .description('fade for mk2 ledn- 0=both, 1=top, 2=bottom')
  .action(function(time, r, g, b, n){
    blink1.fadeToRGBN((parseInt(time) * 1000), parseInt(r), parseInt(g), parseInt(b), parseInt(n));
  });

program
  .command('set <r> <g> <b>')
  .description('set color in rgb')
  .action(function(r, g, b){
    blink1.setRGB(parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('play')
  .description('play entire pattern')
  .action(function(){
    blink1.play(0);
  });

program
  .command('loop <start> <end> <n>')
  .description('play pattern from start to end position, n times, n=0=repeat')
  .action(function(start, end, n){
    blink1.playLoop(parseInt(start), parseInt(end), parseInt(n));
  });

program
  .command('writePatternLine <time> <r> <g> <b> <pos>')
  .description('write pattern with fade time, and rgb, at position')
  .action(function(time, r, g, b, pos){
    blink1.writePatternLine((parseInt(time) * 1000), parseInt(r), parseInt(g),
    parseInt(b), parseInt(pos));
  });

program
  .command('readPatternLine <pos>')
  .description('read pattern at position')
  .action(function(pos){
    blink1.readPatternLine(parseInt(pos), function(value){
      console.log(value);
    })
  });

program
  .command('savePattern')
  .description('save current pattern to flash  mk2 only')
  .action(function(pos){
    blink1.readPatternLine(parseInt(pos));
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
  .command('rainbow <time>')
  .description('continuously rotate through colors over (time * 6) seconds')
  .action(function(time){
    var t = parseInt(time);
    blink1.writePatternLine((t * 1000), 0, 0, 255, 0);
    blink1.writePatternLine((t * 1000), 0, 255, 255, 1);
    blink1.writePatternLine((t * 1000), 0, 255, 0, 2);
    blink1.writePatternLine((t * 1000), 255, 255, 0, 3);
    blink1.writePatternLine((t * 1000), 255, 0, 0, 4);
    blink1.writePatternLine((t * 1000), 255, 0, 255, 5);
    blink1.playLoop(0, 5, 0);
  });

program
  .command('funk')
  .description('play funk patter')
  .action(function(){
    blink1.writePatternLine(500, 200, 160, 0, 0);
    blink1.writePatternLine(300, 0, 55, 200, 1);
    blink1.writePatternLine(500, 230, 0, 200, 2);
    blink1.writePatternLine(300, 0, 200, 130, 3);
    blink1.playLoop(0, 3, 0);
  });

program
  .command('strobe')
  .description('strobe')
  .action(function(){
    blink1.writePatternLine(500, 255, 255, 255, 0);
    blink1.writePatternLine(200, 0, 0, 0, 1);
    blink1.writePatternLine(300, 0, 0, 0, 2);
    blink1.playLoop(0, 2, 0);
  });

program
  .command('secret')
  .description('super secret')
  .action(function(){
    blink1.writePatternLine(200, 200, 160, 0, 0);
    blink1.writePatternLine(500, 200, 160, 0, 1);
    blink1.writePatternLine(200, 0, 55, 200, 2);
    blink1.writePatternLine(500, 0, 55, 200, 3);
    blink1.playLoop(0, 3, 0);
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

program.parse(process.argv);
