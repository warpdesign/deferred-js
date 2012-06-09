(function(global) {
	function bind(fn, that, ret) {
		return function() {
			if (ret) {
				fn.apply(that, arguments);
				return ret;
			}
			else
				return fn.apply(that, arguments);
		};
	}

	function D(func) {
		if (!(this instanceof D))
			return new D();

		this.doneFuncs = [];
		this.failFuncs = [];
		this.resultArgs = null;
		this.status = 'pending';

		// check for option function: call it with this as context and as first parameter, as specified in jQuery api
		if (func)
			func.apply(this, [this]);
	}

	D.when = function() {
		if (arguments.length < 2) {
			var obj = arguments.length ? arguments[0] : undefined;
			if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
				return obj.promise();			
			}
			else {
				return D().resolve(obj).promise();
			}
		}
		else {
			return (function(args){
				var df = D(),
					size = args.length,
					done = 0,
					rp = new Array(size);	// resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved

				for (var i = 0; i < args.length; i++) {
					(function(j) {
						args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(df, rp); /* console.log(rp); */ }})
						.fail(function() { df.reject(arguments); });
					})(i);
				}

				return df.promise();
			})(arguments);
		}
	}

	D.prototype = {
		isResolved:  function() {
			return this.status === 'resolved';
		},

		isRejected: function() {
			return this.status === 'rejected';
		},

		// TODO: clean up
		promise: function() {
			if (arguments.length) {
				switch(typeof arguments[0]) {
					case 'undefined':
						var obj = {};
					break;

					case 'object':
						if (arguments[0] === null)
							var obj = {};
						else
							var obj = arguments[0];
					break;

					default:	// jQuery seems to return the passed parameter in this special case
						return arguments[0];
					break;
				}
			}
			else
				var obj = {};

			if (obj.isResolved === undefined && obj.isRejected === undefined) {		
				obj.promise = bind(this.promise, this);
				obj.then = bind(this.then, this, obj);
				obj.done = bind(this.done, this, obj);
				obj.fail = bind(this.fail, this, obj);
				obj.state = bind(this.state, this, obj);
				obj.always = bind(this.always, this, obj);
				obj.isResolved = bind(this.isResolved, this, obj);
				obj.isRejected = bind(this.isRejected, this, obj);

				return obj;
			}
			else
				return obj.promise();
		},

		reject: function() {
			return this.rejectWith(this, arguments);
		},

		resolve: function() {
			return this.resolveWith(this, arguments);
		},

		exec: function(context, dst, args, st) {
			if (this.status !== 'pending')
				return this;

			this.status = st;

			for (var i = 0; i < dst.length; i++)
				dst[i].apply(context, args);

			return this;
		},

		resolveWith: function(context) {
			var args = this.resultArgs = (arguments.length > 1) ? arguments[1] : [];

			return this.exec(context, this.doneFuncs, args, 'resolved');
		},

		rejectWith: function(context) {
			var args = this.resultArgs = (arguments.length > 1) ? arguments[1] : [];

			return this.exec(context, this.failFuncs, args, 'rejected');
		},

		done: function() {
			for (var i = 0; i < arguments.length; i++) {
				// skip any undefined or null arguments
				if (!arguments[i])
					continue;

				if (arguments[i].constructor === Array ) {
					var arr = arguments[i];
					for (var j = 0; j < arr.length; j++) {
						// immediately call the function if the deferred has been resolved
						if (this.status === 'resolved')
							arr[j].apply(this, this.resultArgs);

						this.doneFuncs.push(arr[j]);
					}
				}
				else {
					// immediately call the function if the deferred has been resolved
					if (this.status === 'resolved')
						arguments[i].apply(this, this.resultArgs);

					this.doneFuncs.push(arguments[i]);
				}
			}
			
			return this;
		},

		fail: function(func) {
			for (var i = 0; i < arguments.length; i++) {
				// skip any undefined or null arguments
				if (!arguments[i])
					continue;

				if (arguments[i].constructor === Array ) {
					var arr = arguments[i];
					for (var j = 0; j < arr.length; j++) {
						// immediately call the function if the deferred has been resolved
						if (this.status === 'rejected')
							arr[j].apply(this, this.resultArgs);

						this.failFuncs.push(arr[j]);
					}
				}
				else {
					// immediately call the function if the deferred has been resolved
					if (this.status === 'rejected')
						arguments[i].apply(this, this.resultArgs);

					this.failFuncs.push(arguments[i]);
				}
			}

			return this;
		},

		always: function() {
			if (arguments.length > 0 && arguments[0])
				this.done(arguments[0]).fail(arguments[0]);

			return this;
		},

		then: function() {
			// fail function(s)
			if (arguments.length > 1 && arguments[1])
				this.fail(arguments[1]);

			// done function(s)
			if (arguments.length > 0 && arguments[0])
				this.done(arguments[0]);

			return this;
		},

		state: function() {
			return this.status;
		}
	};

	global.Deferred = D;
})(window);