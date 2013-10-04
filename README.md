fpscounter
==========

This is a simple in-browser fps counter, with no configuration or options.  [View demo](http://rawgithub.com/pete-otaqui/fpscounter/master/index.html).


Installation
------------

Simply drop the javascript file into your page:

    <script src="http://rawgithub.com/pete-otaqui/fpscounter/master/fpscounter.js"></script>

Or you can add it to any page you are currently browsing with a bookmarklet like this:

    javascript:(function(){var s=document.createElement('script');s.src='//rawgithub.com/pete-otaqui/fpscounter/master/fpscounter.js';document.querySelector('head').appendChild(s);})()


Configuration
-------------

fpscounter doesn't need any configuration to run, but you can supply some if you like.  Simple create a global object called ```fpscounter_options``` before the fpscounter.js file is executed.  You have the following configuration directives, defaults are shown:

    <script>
        fpscounter_options = {
            auto_start : true, // should the fpscounter start right away?
            width : 100, // width of the fpscounter
            height: 50, // height of the fpscounter
            remove_on_click: false // should clicking remove instead of pausing?
        };
    </script>
    <script src="http://rawgithub.com/pete-otaqui/fpscounter/master/fpscounter.js"></script>

Assuming you've disabled ```auto_start```, simply call the ```fpscounter()``` from your code to manually start it:

    <script>
        fpscounter_options = { auto_start : false };
    </script>
    <script src="http://rawgithub.com/pete-otaqui/fpscounter/master/fpscounter.js"></script>
    <script>
        document.getElementById('my-button').addEventListener('click', function() {
            fpscounter({width: 100, height: 100});
        }, false);
    </script>

All options (except ```auto_start```) are the same between the ```fpscounter_options``` object and the argument passed to the ```fpscounter()``` function

Notes
-----

fpscounter displays the current fps as text, and a history graph (higher is better) for the last period of time.  The history graph automatically scales to delta between the least and greatest values within the history being shown, and these numbers are also printed.


License
-------

This code is available under the [Creative Commons Attribution 3.0 Unported](http://creativecommons.org/licenses/by/3.0/deed.en_GB) license.
