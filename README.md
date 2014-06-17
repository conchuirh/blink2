# blink2
a command line tool for [blink(1)](http://thingm.com/products/blink-1.html)
built using [commander.js](http://visionmedia.github.io/commander.js/)

### Recommended USAGE
    $ git clone https://github.com/conchuirh/blink2.git
    $ cd blink2
    $ npm install
    $ npm link
    $ blink set r g b

### COMMANDS
    $ blink2 devices //lists serial #'s of connected blink(1)'s
    $ blink2 fade time r g b //time in milliseconds
    $ blink2 set r g b //sets color to (r,g,b)
    $ blink2 rainbow //rotates through colors
    $ blink2 here //sets color to green
    $ blink2 away //sets color to yellow
    $ blink2 busy //sets color to red
    $ blink2 light //full bright white
    $ blink2 light-low //less bright white

### NEW COMMANDS
to add new commands to blink2 modify lib/blink2.js
##### Example
    program
      .command('busy')//name of command
      .description('set color to red')//description
      .action(function(){
        //code to run on command
        blink1.fadeToRGB(100, 255, 0, 0);//sets color to red over 100 milliseconds
      });
