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
  .command('set <r> <g> <b>')
  .description('set color in rgb')
  .action(function(r, g, b){
    blink1.setRGB(parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('rainbow-2')
  .description('rotate through colors')
  .action(function(){
    blink1.fadeToRGB(1000, 255, 0, 0);
    sleep.sleep(1);
    blink1.fadeToRGB(1000, 0, 255, 0);
    sleep.sleep(1);
    blink1.fadeToRGB(1000, 0, 0, 255);
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
  .command('off')
  .description('')
  .action(function(){
    blink1.close();
  });

program.parse(process.argv);
