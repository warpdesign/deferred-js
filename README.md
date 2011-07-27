Standalone-Deferred
==================

deferred.js is a standalone implementation of deferreds aims to be fully compatible with $.Deferred found in jQuery 1.5+.

This version has been tested with only a few examples: it may contains bugs and incompatibilites.


Usage
-----

First include the deferred.js file on your page

	<script type="text/javascript" src="path/to/deferred.js"></script>

Unlike jQuery.Deferred, deferred must be called with the new keyword (this will be fixed in the future):

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


What's Missing ?
----------------

Standalone-Deferred currently doesn't implement the pipe method found inside jQuery Deferreds.


Contact
-------

nicolas.ramz@gmail.com