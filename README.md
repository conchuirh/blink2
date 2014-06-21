# blink2
a command line tool for [blink(1)](http://thingm.com/products/blink-1.html)
built using [commander.js](http://visionmedia.github.io/commander.js/)
and [node-blink(1)](https://github.com/sandeepmistry/node-blink1).
blink2 is still not complete and is not tested for mk1's.

##### TODO:
*  add pattern support for individual LEDs on the mk2
*  finish making node-blink1 fully compatible with the mk1

## Recommended usage
    $ git clone https://github.com/conchuirh/blink2.git
    $ cd blink2
    $ npm install
    $ npm link
    $ blink set r g b

## COMMANDS

*  r = red   0-255
*  g = green 0-255
*  b = blue  0-255
*  time is in seconds
*  ledn = led number (mk2 only) 0=both, 1=top led, 2=bottom led
*  pos = position in pattern flash memory (0-11 for mk1)

#### controls

    $ blink2 devices //lists serial #'s of connected blink(1)'s
    $ blink2 fade time r g b ledn //time in milliseconds, leave ledn empty for mk1
    $ blink2 set r g b //sets color to (r,g,b)
    $ blink2 play //plays current pattern from start
    $ blink2 writePatternLine time r g b pos //writes pattern to pos
    $ blink2 readPatternLine pos //gets pattern line at pos
    $ blink2 off //turns off light and closes HID connection 

#### color commands  

    $ blink2 random //fades to random color
    $ blink2 here //sets color to green
    $ blink2 away //sets color to yellow
    $ blink2 busy //sets color to red
    $ blink2 light //full bright white
    $ blink2 light-low //less bright white

#### For blink(1) mk2

    $ blink2 loop start end n //play pattern from pos start to pos end n times(n=0 is a repeating loop)
    $ blink2 savePattern //saves current pattern to flash memory
    $ blink2 random2 // each led is set to a random color
    $ blink2 rainbow //rotates through colors
    $ blink2 funk
    $ blink2 strobe

### NEW COMMANDS
to add new commands to blink2, modify lib/blink2.js
##### Example
This command is called as blink2 busy, and it sets the color to red

    program
      .command('busy')//name of command
      .description('set color to red')//description
      .action(function(){
        //code to run on command
        blink1.fadeToRGB(100, 255, 0, 0);//sets color to red over 100 milliseconds
      });

##### Pattern Example

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
