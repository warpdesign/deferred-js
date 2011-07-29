Standalone-Deferred
===================

deferred.js is a standalone implementation of deferreds aims to be fully compatible with $.Deferred found in [jQuery 1.5+] (http://api.jquery.com/category/deferred-object/).


What's implemented ?
--------------------

* Deferred()/new Deferred()

* Deferred.when
* Deferred.always
* Deferred.then
* Deferred.promise
* Deferred.isResolved
* Deferred.isRejected
* Deferred.resolve
* Deferred.resolveWith
* Deferred.reject
* Deferred.rejectWith
* Deferred.done
* Deferred.fail


What's Missing ?
----------------

* Deferred.pipe


Usage
-----

First include the deferred.js file on your page

	<script type="text/javascript" src="path/to/deferred.js"></script>

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

Contact
-------

nicolas.ramz@gmail.com