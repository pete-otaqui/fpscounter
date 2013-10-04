fpscounter
==========

This is a simple in-browser fps counter, with no configuration or options.  [View demo](http://rawgithub.com/pete-otaqui/fpscounter/master/index.html).


Installation
------------

Simply drop the javascript file into your page:

    <script src="http://rawgithub.com/pete-otaqui/fpscounter/master/"></script>

Or you can add it to any page you are currently browsing with a bookmarklet like this:

    javascript:(function(){var s=document.createElement('script');s.src='//rawgithub.com/pete-otaqui/fpscounter/master/fpscounter.js';document.querySelector('head').appendChild(s);})()


Notes
-----

fpscounter displays the current fps as text, and a history graph (higher is better) for the last period of time.  The history graph automatically scales to delta between the least and greatest values within the history being shown, and these numbers are also printed.


License
-------

This code is available under the [Creative Commons Attribution 3.0 Unported](http://creativecommons.org/licenses/by/3.0/deed.en_GB) license.
