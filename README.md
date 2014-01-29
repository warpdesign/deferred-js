deferred-js
===========

deferred-js is a light (less than 1 kb gzipped) standalone implementation of promise/deferred that aims to be fully compatible with $.Deferred found in [jQuery 1.5+] (http://api.jquery.com/category/deferred-object/).


What's implemented ?
--------------------

* Deferred.always
* Deferred.done
* Deferred.fail
* Deferred.isRejected
* Deferred.isResolved
* Deferred.notify
* Deferred.notifyWith
* Deferred.progress
* Deferred.promise
* Deferred.reject
* Deferred.rejectWith
* Deferred.resolve
* Deferred.resolveWith
* Deferred.state
* Deferred.then
* Deferred.when


What's Missing ?
----------------

* Deferred.pipe


Setup
-----

#### Using nodejs
 * type in a terminal: `npm install deferred-js`
 * require deferred-js: `var Deferred = require('deferred-js');`

#### Using a browser
 * include the deferred script: `<script type="text/javascript" src="deferred.js"></script>`
 * Deferred is available inside the global object

Example
-------

	// Create a Deferred and return its Promise
	function asyncEvent(){
		var dfd = new Deferred();
		setTimeout(function(){
			dfd.resolve("hurray");
		}, Math.floor(Math.random()*1500));
		setTimeout(function(){
			dfd.reject("sorry");
		}, Math.floor(Math.random()*1500));
		return dfd.promise();
	}

	// Attach a done and fail handler for the asyncEvent
	Deferred.when(asyncEvent()).then(
		function(status){
			console.log( status+', things are going well' );
		},
		function(status){
			console.log( status+', you fail this time' );
		}
	);

Licence
-------

This software is distributed under an MIT licence.

Copyright 2012 © Nicolas Ramz

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
