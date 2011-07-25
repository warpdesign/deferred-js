if (Function.prototype.bind == null) {

	Function.prototype.bind = (function (slice){

		// (C) WebReflection - Mit Style License
		function bind(context) {

			var self = this; // "trapped" function reference

			// only if there is more than an argument
			// we are interested into more complex operations
			// this will speed up common bind creation
			// avoiding useless slices over arguments
			if (1 < arguments.length) {
				// extra arguments to send by default
				var $arguments = slice.call(arguments, 1);
				return function () {
					return self.apply(
						context,
						// thanks @kangax for this suggestion
						arguments.length ?
							// concat arguments with those received
							$arguments.concat(slice.call(arguments)) :
							// send just arguments, no concat, no slice
							$arguments
					);
				};
			}
			// optimized callback
			return function () {
				// speed up when function is called without arguments
				return arguments.length ? self.apply(context, arguments) : self.call(context);
			};
		}

		// the named function
		return bind;

	}(Array.prototype.slice));
}


function Deferred()
{
	this.doneFuncs = [];
	this.failFuncs = [];
	this.resultArgs = null;
	this.status = '';

	// check for option function: call it with this as context and as first parameter, as specified in jQuery api
	if ((arguments.length > 0) && (typeof arguments[0] === 'function'))
		arguments[0].apply(this, [this]);
}

Deferred.prototype.isResolved = function()
{
	return this.status === 'resolved';
}

Deferred.prototype.isRejected = function()
{
	return this.status === 'rejected';
}

Deferred.prototype.promise = function()
{
	var self = this,
	obj = (arguments.length < 1) ? {} : arguments[0];

	obj.then = self.then.bind(self);
	obj.done = self.done.bind(self);
	obj.fail = self.fail.bind(self);
	obj.always = self.always.bind(self);
	obj.pipe = self.pipe.bind(self);
	obj.isResolved = self.isResolved.bind(self);
	obj.isRejected = self.isRejected.bind(self);

	return obj;
}

Deferred.prototype.reject = function()
{
	return this.rejectWith(this, arguments);
}

Deferred.prototype.resolve = function()
{
	return this.resolveWith(this, arguments);
}

Deferred.prototype.resolveWith = function(context)
{
	var args = this.resultArgs = (arguments.length > 1) ? arguments[1] : [];

	if (this.status !== '')
		return this;

	this.status = 'resolved';

	for (var i = 0; i < this.doneFuncs.length; i++)
		this.doneFuncs[i].apply(context, args);

	return this;
}

Deferred.prototype.rejectWith = function(context)
{
	var args = this.resultArgs = (arguments.length > 1) ? arguments[1] : [];

	if (this.status !== '')
		return this;
	
	this.status = 'rejected';

	for (var i = 0; i < this.failFuncs.length; i++)
		this.failFuncs[i].apply(context, args);

	return this;
}

Deferred.prototype.always = function()
{
	var context = this;
	if (arguments.length > 0 && arguments[0])
	{
		if (arguments[0].constructor === Array ) {
			var arr = arguments[0];
			for (var j = 0; j < arr.length; j++) {
				// immediately call the function if the deferred has been rejected
				if (this.status !== '')
					arr[j].apply(context, this.resultArgs);
				else
				{
					this.doneFuncs.push(arr[j]);
					this.failFuncs.push(arr[j]);
				}
			}
		}
		else if (typeof arguments[0] === 'function') {
			// immediately call the function if the deferred has been resolved
			if (this.status !== '')
				arguments[0].apply(context, this.resultArgs);
			else
			{
				this.doneFuncs.push(arguments[0]);
				this.failFuncs.push(arguments[0]);
			}
		}
	}
	return this;
}

Deferred.prototype.then = function()
{
	var context = this;

	// fail function(s)
	if (arguments.length > 1 && arguments[1]) {
		fails = arguments[1];

		if (fails.constructor === Array ) {

			for (var j = 0; j < fails.length; j++) {
				if (this.done)
					fails[j].apply(context, this.resultArgs);

				this.failFuncs.push(fails[j]);
			}
		}
		else if (typeof fails === 'function')
			this.failFuncs.push(fails);
	}

	// done function(s)
	if (arguments.length > 0 && arguments[0]) {
		dones = arguments[0];

		if (dones.constructor === Array ) {

			for (var j = 0; j < dones.length; j++) {
				if (this.done)
					dones[j].apply(context, this.resultArgs);

				this.doneFuncs.push(dones[j]);
			}
		}
		else if (typeof dones === 'function')
			this.doneFuncs.push(dones);
	}

	return this;
}

Deferred.prototype.done = function()
{
	var context = this;
	for (var i = 0; i < arguments.length; i++) {
		// skip any undefined or null arguments
		if (!arguments[i])
			continue;

		if (arguments[i].constructor === Array ) {
			var arr = arguments[i];
			for (var j = 0; j < arr.length; j++) {
				// immediately call the function if the deferred has been resolved
				if (this.status === 'resolved')
					arr[j].apply(context, this.resultArgs);

				this.doneFuncs.push(arr[j]);
			}
		}
		else if (typeof arguments[i] === 'function') {
			// immediately call the function if the deferred has been resolved
			if (this.status === 'resolved')
				arguments[i].apply(context, this.resultArgs);

			this.doneFuncs.push(arguments[i]);
		}
	}
	
	return this;
}

Deferred.prototype.fail = function(func)
{
	var context = this;
	for (var i = 0; i < arguments.length; i++) {
		// skip any undefined or null arguments
		if (!arguments[i])
			continue;

		if (arguments[i].constructor === Array ) {
			var arr = arguments[i];
			for (var j = 0; j < arr.length; j++) {
				// immediately call the function if the deferred has been resolved
				if (this.status === 'rejected')
					arr[j].apply(context, this.resultArgs);

				this.failFuncs.push(arr[j]);
			}
		}
		else if (typeof arguments[i] === 'function') {
			// immediately call the function if the deferred has been resolved
			if (this.status === 'rejected')
				arguments[i].apply(context, this.resultArgs);

			this.failFuncs.push(arguments[i]);
		}
	}

	return this;
}

// TODO: implement !
Deferred.prototype.pipe = function()
{

}