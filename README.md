#blink2
a command line tool for [blink(1)](http://thingm.com/products/blink-1.html)
built using [commander.js](http://visionmedia.github.io/commander.js/)

###USAGE
    $ git clone https://github.com/conchuirh/blink2.git
    $ cd blink2
    $ npm install
    $ npm link
    $ blink set r g b

###COMMANDS
    $ blink2 devices //lists serial #'s of connected blink(1)'s
    $ blink2 fade time r g b //time in milliseconds
    $ blink2 set r g b //sets color to (r,g,b)
    $ blink2 rainbow //rotates through colors
    $ blink2 here //sets color to green
    $ blink2 away //sets color to yellow
    $ blink2 busy //sets color to red
    $ blink2 light //full bright white
    $ blink2 light-low //less bright white

###NEW COMMANDS
to add new commands to blink2 modify lib/blink2.js
#####Example
    program
      .command('rainbow')//name of command
      .description('Rotates through colors')//description
      .action(function(){//code that runs on command
        blink1.fadeToRGB(1000, 255, 0, 0);//fade to color in rgb
        sleep.sleep(1);//wait for 1 second(node will not wait for fade otherwise)
        blink1.fadeToRGB(1000, 0, 255, 0);
        sleep.sleep(1);
        blink1.fadeToRGB(1000, 0, 0, 255);
    });
