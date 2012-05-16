Standalone-Deferred
===================

deferred.js is a standalone implementation of deferreds aims to be fully compatible with $.Deferred found in [jQuery 1.5+] (http://api.jquery.com/category/deferred-object/).

Unlike jQZoom you move directly within the magnified zone.

Usage
-----

Example:

$('#ul').zoom(options);

available options:

 divName:           '#zoom',        // div that will hold the zoomed (magnified) pictured
 delay:             1,              // delay in ms between each mousemove poll
 cursor:            'crosshair',    // cursor pointer
 grabCursor:        'move',    // cursor when zoomed
 grabbingCursor:    'move',         // cursor when grabbing
 movingCursor:      'move',
 selected:          0,              // initially selected file
 startEvent:        'dblclick',     // event that will run the magnify, must be a valid bindable jQuery event
 loupe:             'loupe.gif',    // loop overlay, set to false to disable
 loupeInfo:         {normal: 'Click here to zoom', zoomed: 'Click here to go to normal size'},
 drag:              false,          // drag&drop mode
 debug:             false,          // Enable debug (needs console object)
 keepZoom:          false,          // If zoom mode is activated and a thumbnail is selected, it goes to zoom mode
 zoomTrack:         false,          // keep track of zoom in the thumbnail
 loaderImg:         'loader.gif'    // Loading image displayed before we get img size

See sample for sample code.

Licence
-------

This software is distributed under an MIT licence.

Copyright 2011 © Nicolas Ramz

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software
> and associated documentation files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following conditions:
> The above copyright notice and this permission notice shall be included in all copies or
> substantial portions of the Software.
> The Software is provided "as is", without warranty of any kind, express or implied, including
> but not limited to the warranties of merchantability, fitness for a particular purpose and
> noninfringement. In no event shall the authors or copyright holders be liable for any claim,
> damages or other liability, whether in an action of contract, tort or otherwise, arising from,
> out of or in connection with the software or the use or other dealings in the Software.