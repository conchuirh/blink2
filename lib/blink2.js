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
  .description('')
  .action(function(){
    console.log(Blink1.devices());
  });

program
  .command('fade <time> <r> <g> <b>')
  .description('')
  .action(function(time, r, g, b){
    blink1.fadeToRGB(parseInt(time), parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('set <r> <g> <b>')
  .description('')
  .action(function(r, g, b){
    blink1.setRGB(parseInt(r), parseInt(g), parseInt(b));
  });

program
  .command('rainbow')
  .description('')
  .action(function(){
    blink1.fadeToRGB(1000, 255, 0, 0);
    sleep.sleep(1);
    blink1.fadeToRGB(1000, 0, 255, 0);
    sleep.sleep(1);
    blink1.fadeToRGB(1000, 0, 0, 255);
  });

program
  .command('here')
  .description('')
  .action(function(){
    blink1.fadeToRGB(100, 0, 255, 0);
  });

program
  .command('away')
  .description('')
  .action(function(){
    blink1.fadeToRGB(100, 255, 255, 0);
  });

program
  .command('busy')
  .description('')
  .action(function(){
    blink1.fadeToRGB(100, 255, 0, 0);
  });

program
  .command('light')
  .description('')
  .action(function(){
    blink1.fadeToRGB(100, 255, 255, 255);
  });

program
  .command('light-low')
  .description('')
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
