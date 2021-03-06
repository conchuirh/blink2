#! /usr/bin/env node

var program = require('commander'),
    request = require('request-json'),
    test    = require('./version.js');

var client = request.newClient("http://worldcup.sfg.io/matches/current");

var devices = test.devices();
if(parseInt(devices[0]) >= 20000) {
  var Blink1 = require('./blink1-mk2-lib');
} else { var Blink1 = require('node-blink1'); }

var blink1;
try {
  blink1 = new Blink1.Blink1();
} catch(err) {
  console.log("no blink1 devices found");
  process.exit(1);
}

program
  .version('0.2.0')

program
  .command('devices')
  .description('prints array of serial #s')
  .action(function(){
    console.log(Blink1.devices());
  });

program
  .command('fade <time> <r> <g> <b> [ledn]')
  .description('fade to color in rgb over time in seconds')
  .action(function(time, r, g, b, ledn){
    blink1.fadeToRGB((parseInt(time) * 1000), parseInt(r), parseInt(g), parseInt(b), parseInt(ledn));
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
     Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 0);
  });

program
  .command('random2')
  .description('random colors in both leds    mk2 only')
  .action(function(){
    blink1.fadeToRGB(1000, Math.floor(Math.random() * 255),
     Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1);
    blink1.fadeToRGB(1000, Math.floor(Math.random() * 255),
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
    blink1.writePatternLine(200, 230, 0, 200, 4);
    blink1.writePatternLine(500, 230, 0, 200, 5);
    blink1.writePatternLine(200, 0, 200, 130, 6);
    blink1.writePatternLine(500, 0, 200, 130, 7);
    blink1.playLoop(0, 7, 0);
  });

program
  .command('here')
  .description('set color to green')
  .action(function(){
    blink1.fadeToRGB(100, 0, 255, 0, 0);
  });

program
  .command('away')
  .description('set color to yellow')
  .action(function(){
    blink1.fadeToRGB(100, 255, 255, 0, 0);
  });

program
  .command('busy')
  .description('set color to red')
  .action(function(){
    blink1.fadeToRGB(100, 255, 0, 0, 0);
  });

program
  .command('light')
  .description('set color to bright white')
  .action(function(){
    blink1.fadeToRGB(100, 255, 255, 255, 0);
  });

program
  .command('light-low')
  .description('set color to white')
  .action(function(){
    blink1.fadeToRGB(100, 150, 150, 150, 0);
  });

program
  .command('worldcup')
  .description('get worlcup score and display winning color/ or white if tie')
  .action(function(){
    getAwayTeam(function(awayCode, awayGoals){
      getHomeTeam(function(homeCode, homeGoals){
        console.log(awayCode + ' ' + awayGoals);
        console.log(homeCode + ' ' + homeGoals);
        if(homeGoals > awayGoals){
          setColor(homeCode);
        }
        else if(homeGoals < awayGoals){
          setColor(awayCode);
        }
        else {
          blink1.fadeToRGB(100, 255, 255, 255, 0);
       }
      });
    });
  });

program
  .command('off')
  .description('turn off')
  .action(function(){
    blink1.fadeToRGB(100, 0, 0, 0, 0);
    blink1.close();
  });

program.parse(process.argv);

/** world cupppppp  **/

function getAwayTeam(callback){
  client.get('', function(err, res, body){
    var awayCode = body[0].away_team.code;
    var goals    = body[0].away_team.goals;
    callback(awayCode, goals);
  });
};

function getHomeTeam(callback){
  client.get('', function(err, res, body){
    var homeCode = body[0].home_team.code;
    var goals    = body[0].home_team.goals;
    callback(homeCode, goals);
  });
};

setColor = function(code){
  switch(code){
  default:
  case "ALG":
  case "IRN":
  case "ITA":
  case "MEX":
  case "POR":
    blink1.writePatternLine(200, 0, 255, 0, 0);
    blink1.writePatternLine(500, 0, 255, 0, 1);
    blink1.writePatternLine(200, 255, 0, 0, 2);
    blink1.writePatternLine(500, 255, 0, 0, 3);
    blink1.playLoop(0,3,0);
    break;
  case "ARG":
  case "GRE":
  case "HON":
  case "URU":
    blink1.writePatternLine(200, 0, 255, 255, 0);
    blink1.writePatternLine(500, 0, 255, 255, 1);
    blink1.writePatternLine(200, 255, 255, 255, 2);
    blink1.writePatternLine(500, 255, 255, 255, 3);
    blink1.playLoop(0,3,0);
    break;
  case "AUS":
  case "CHI":
  case "CRO":
  case "ENG":
  case "FRA":
  case "RUS":
  case "USA":
    blink1.writePatternLine(200, 0, 0, 255, 0);
    blink1.writePatternLine(500, 0, 0, 255, 1);
    blink1.writePatternLine(200, 255, 0, 0, 2);
    blink1.writePatternLine(500, 255, 0, 0, 3);
    blink1.playLoop(0,3,0);
    break;
  case "BIH":
    blink1.writePatternLine(200, 0, 0, 255, 0);
    blink1.writePatternLine(500, 0, 0, 255, 1);
    blink1.writePatternLine(200, 255, 255, 0, 2);
    blink1.writePatternLine(500, 255, 255, 0, 3);
    blink1.playLoop(0,3,0);
    break;
  case "BEL":
  case "ECU":
  case "ESP":
  case "GER":
    blink1.writePatternLine(200, 255, 0, 0, 0);
    blink1.writePatternLine(500, 255, 0, 0, 1);
    blink1.writePatternLine(200, 255, 255, 0, 2);
    blink1.writePatternLine(500, 255, 255, 0, 3);
    blink1.playLoop(0,3,0);
    break;
  case "BRA":
  case "CMR":
  case "GHA":
    blink1.writePatternLine(200, 0, 255, 0, 0);
    blink1.writePatternLine(500, 0, 255, 0, 1);
    blink1.writePatternLine(200, 255, 255, 0, 2);
    blink1.writePatternLine(500, 255, 255, 0, 3);
    blink1.playLoop(0,3,0);
    break;
  case "CIV":
    blink1.writePatternLine(200, 0, 255, 0, 0);
    blink1.writePatternLine(500, 0, 255, 0, 1);
    blink1.writePatternLine(200, 255, 100, 0, 2);
    blink1.writePatternLine(500, 255, 100, 0, 3);
    blink1.playLoop(0,3,0);
    break;
  case "COL":
    blink1.writePatternLine(200, 255, 255, 0, 0);
    blink1.writePatternLine(500, 255, 255, 0, 1);
    blink1.writePatternLine(200, 0, 0, 255, 2);
    blink1.writePatternLine(500, 0, 0, 255, 3);
    blink1.playLoop(0,3,0);
    break;
  case "CRC":
    blink1.writePatternLine(200, 0, 0, 255, 0);
    blink1.writePatternLine(500, 0, 0, 255, 1);
    blink1.writePatternLine(200, 255, 255, 255, 2);
    blink1.writePatternLine(500, 255, 255, 255, 3);
    blink1.playLoop(0,3,0);
    break;
  case "JPN":
  case "KOR":
  case "SUI":
    blink1.writePatternLine(200, 255, 0, 0, 0);
    blink1.writePatternLine(500, 255, 0, 0, 1);
    blink1.writePatternLine(200, 255, 255, 255, 2);
    blink1.writePatternLine(500, 255, 255, 255, 3);
    blink1.playLoop(0,3,0);
    break;
  case "NED":
    blink1.writePatternLine(200, 255, 100, 0, 0);
    blink1.writePatternLine(500, 255, 100, 0, 1);
    blink1.writePatternLine(200, 255, 255, 255, 2);
    blink1.writePatternLine(500, 255, 255, 255, 3);
    blink1.playLoop(0,3,0);
    break;
  case "NGA":
    blink1.writePatternLine(200, 0, 255, 0, 0);
    blink1.writePatternLine(500, 0, 255, 0, 1);
    blink1.writePatternLine(200, 255, 255, 255, 2);
    blink1.writePatternLine(500, 255, 255, 255, 3);
    blink1.playLoop(0,3,0);
    break;
  }
};
