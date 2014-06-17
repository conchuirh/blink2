# blink2
a command line tool for [blink(1)](http://thingm.com/products/blink-1.html)
built using [commander.js](http://visionmedia.github.io/commander.js/)
and [node-blink(1)](https://github.com/sandeepmistry/node-blink1)

### Recommended USAGE
    $ git clone https://github.com/conchuirh/blink2.git
    $ cd blink2
    $ npm install
    $ npm link
    $ blink set r g b

### COMMANDS
r, g, b, and time are all integers

    $ blink2 devices //lists serial #'s of connected blink(1)'s
    $ blink2 fade time r g b //time in milliseconds
    $ blink2 set r g b //sets color to (r,g,b)
    $ blink2 rainbow //rotates through colors
    $ blink2 rainbow-time time //fades from color to color, total time is (6 * time)
    $ blink2 here //sets color to green
    $ blink2 away //sets color to yellow
    $ blink2 busy //sets color to red
    $ blink2 light //full bright white
    $ blink2 light-low //less bright white

For blink(1) mk2

    $ blink2 fadeN time r g b n //n= 0 both leds, n=1 top led, n=2 bottom led

### NEW COMMANDS
to add new commands to blink2, modify lib/blink2.js
##### Example
    program
      .command('busy')//name of command
      .description('set color to red')//description
      .action(function(){
        //code to run on command
        blink1.fadeToRGB(100, 255, 0, 0);//sets color to red over 100 milliseconds
      });
