(function(global){
	function bind(fn, that)
	{
		return function() {
			return fn.apply(that, arguments);
		};
	}

	function D(func)
	{
		this.doneFuncs = [];
		this.failFuncs = [];
		this.resultArgs = null;
		this.status = '';

		// check for option function: call it with this as context and as first parameter, as specified in jQuery api
		if (func)
			func.apply(this, [this]);
	}

	D.prototype.isResolved = function()
	{
		return this.status === 'rs';
	}

	D.prototype.isRejected = function()
	{
		return this.status === 'rj';
	}

	D.prototype.promise = function()
	{
		var self = this,
		obj = (arguments.length < 1) ? {} : arguments[0];

		obj.then = self.then.bind(self);
		obj.done = self.done.bind(self);
		obj.fail = self.fail.bind(self);
		obj.always = self.always.bind(self);
		obj.isResolved = self.isResolved.bind(self);
		obj.isRejected = self.isRejected.bind(self);

		return obj;
	}

	D.prototype.reject = function()
	{
		return this.rejectWith(this, arguments);
	}

	D.prototype.resolve = function()
	{
		return this.resolveWith(this, arguments);
	}

	D.prototype.exec = function(context, dst, args, st)
	{
		if (this.status !== '')
			return this;

		this.status = st;

		for (var i = 0; i < dst.length; i++)
			dst[i].apply(context, args);

		return this;
	}

	D.prototype.resolveWith = function(context)
	{
		var args = this.resultArgs = (arguments.length > 1) ? arguments[1] : [];

		return this.exec(context, this.doneFuncs, args, 'rs');
	}

	D.prototype.rejectWith = function(context)
	{
		var args = this.resultArgs = (arguments.length > 1) ? arguments[1] : [];

		return this.exec(context, this.failFuncs, args, 'rj');
	}

	D.prototype.done = function()
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
					if (this.status === 'rs')
						arr[j].apply(context, this.resultArgs);

					this.doneFuncs.push(arr[j]);
				}
			}
			else
			{
				// immediately call the function if the deferred has been resolved
				if (this.status === 'rs')
					arguments[i].apply(context, this.resultArgs);

				this.doneFuncs.push(arguments[i]);
			}
		}
		
		return this;
	}

	D.prototype.fail = function(func)
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
					if (this.status === 'rj')
						arr[j].apply(context, this.resultArgs);

					this.failFuncs.push(arr[j]);
				}
			}
			else
			{
				// immediately call the function if the deferred has been resolved
				if (this.status === 'rj')
					arguments[i].apply(context, this.resultArgs);

				this.failFuncs.push(arguments[i]);
			}
		}

		return this;
	}

	D.prototype.always = function()
	{
		if (arguments.length > 0 && arguments[0])
		{
			this.done(arguments[0]);
			this.fail(arguments[0]);
		}
		return this;
	}

	D.prototype.then = function()
	{
		// fail function(s)
		if (arguments.length > 1 && arguments[1])
			this.fail(arguments[1]);

		// done function(s)
		if (arguments.length > 0 && arguments[0])
			this.done(arguments[0]);

		return this;
	}

	global.Deferred = D;
})(window);