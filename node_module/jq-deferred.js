// deferred/deferred
module.exports = (function(window) {
    var deferId = 0,
        defNum = 0,
        isArray = function(arr) {
		  return Object.prototype.toString.call(arr) === '[object Array]';
	   };    
    
	function foreach(arr, handler) {
		if (isArray(arr)) {
			for (var i = 0; i < arr.length; i++) {
				handler(arr[i]);
			}
		}
		else
			handler(arr);
	}
    
	function D(fn) {
		var status = 'pending',
			doneFuncs = [],
			failFuncs = [],
			progressFuncs = [],
            lastNotify = null,
			resultArgs = null,
            thisId = deferId++,

		promise = {
			done: function() {
				for (var i = 0; i < arguments.length; i++) {
					// skip any undefined or null arguments
					if (!arguments[i]) {
						continue;
					}

					if (isArray(arguments[i])) {
						var arr = arguments[i];
						for (var j = 0; j < arr.length; j++) {
							// immediately call the function if the deferred has been resolved
							if (status === 'resolved') {
								arr[j].apply(this === deferred ? promise : this, resultArgs);
							}

							doneFuncs.push(arr[j].bind(this === deferred ? promise : this));
						}
					}
					else {
						// immediately call the function if the deferred has been resolved
						if (status === 'resolved') {
							arguments[i].apply(this === deferred ? promise : this, resultArgs);
						}

						doneFuncs.push(arguments[i].bind(this === deferred ? promise : this));
					}
				}
				
				return this;
			},

			fail: function() {
				for (var i = 0; i < arguments.length; i++) {
					// skip any undefined or null arguments
					if (!arguments[i]) {
						continue;
					}

					if (isArray(arguments[i])) {
						var arr = arguments[i];
						for (var j = 0; j < arr.length; j++) {
							// immediately call the function if the deferred has been resolved
							if (status === 'rejected') {
								arr[j].apply(this === deferred ? promise : this, resultArgs);
							}

							failFuncs.push(arr[j].bind(this === deferred ? promise : this));
						}
					}
					else {
						// immediately call the function if the deferred has been resolved
						if (status === 'rejected') {
							arguments[i].apply(this === deferred ? promise : this, resultArgs);
						}

						failFuncs.push(arguments[i].bind(this === deferred ? promise : this));
					}
				}
				
				return this;
			},

			always: function() {
//				return promise.done.apply(this, arguments).fail.apply(this, arguments);
                promise.done.apply(promise, arguments).fail.apply(promise, arguments);
                
                return this;
			},

			progress: function() {
				for (var i = 0; i < arguments.length; i++) {
					// skip any undefined or null arguments
					if (!arguments[i]) {
						continue;
					}

					if (isArray(arguments[i])) {
						var arr = arguments[i];
						for (var j = 0; j < arr.length; j++) {
							// immediately call the function if the deferred has been resolved/rejected
							if (status === 'pending') {
				                progressFuncs.push(arr[j]);
							}
                            if (lastNotify !== null){
                               arr[j].apply(deferred, lastNotify);
                            }                            
						}
					}
					else {
						// immediately call the function if the deferred has been resolved/rejected
						if (status === 'pending') {    
                            progressFuncs.push(arguments[i]);
							}
                            if (lastNotify !== null){
					           arguments[i].apply(deferred, lastNotify);
                            }                                                
					   }
				}

//                if (status !== 'pending' && lastNotify !== null) {
//                    deferred.notifyWith.apply(deferred, lastNotify);
//                }
                
				return this;
			},

//			then: function() {
//				// fail callbacks
//				if (arguments.length > 1 && arguments[1]) {
//					this.fail(arguments[1]);
//				}
//
//				// done callbacks
//				if (arguments.length > 0 && arguments[0]) {
//					this.done(arguments[0]);
//				}
//
//				// notify callbacks
//				if (arguments.length > 2 && arguments[2]) {
//					this.progress(arguments[2]);
//				}
//                
//                return this;
//			},

			promise: function(obj) {
				if (obj == null) {
					return promise;
				} else {
					for (var i in promise) {
						obj[i] = promise[i];
					}
					return obj;
				}
			},

			state: function() {
				return status;
			},

			debug: function() {
                console.log('id', thisId);
				console.log('[debug]', doneFuncs, failFuncs, status);
			},

			isRejected: function() {
				return status === 'rejected';
			},

			isResolved: function() {
				return status === 'resolved';
			},

			pipe: function(done, fail, progress) {
				var newDef = D(function(def) {
                    var that = this;
					foreach(done || null, function(func) {
						// filter function
						if (typeof func === 'function') {
							deferred.done(function() {
								var returnval = func.apply(this, arguments);
								// if a new deferred/promise is returned, its state is passed to the current deferred/promise
								if (returnval && typeof returnval.promise === 'function') {
									returnval.promise().done(def.resolve).fail(def.reject).progress(def.notify);
								}
								else {	// if new return val is passed, it is passed to the piped done
									def.resolveWith(this === promise ? def.promise() : this, [returnval]);
								}
							}.bind(that));
						} else {
							deferred.done(def.resolve);
						}
					});

					foreach(fail || null, function(func) {
						if (typeof func === 'function') {
							deferred.fail(function() {
								var returnval = func.apply(this, arguments);
								
								if (returnval && typeof returnval.promise === 'function') {
									returnval.promise().done(def.resolve).fail(def.reject).progress(def.notify);
								} else {
									def.rejectWith(this === promise ? def.promise() : this, [returnval]);
								}
							}.bind(that));
						}
						else {
							deferred.fail(def.reject);
						}
					});
                    
					foreach(progress || null, function(func) {
						if (typeof func === 'function') {
							deferred.progress(function() {
								var returnval = func.apply(this, arguments);
								
								if (returnval && typeof returnval.promise === 'function') {
									returnval.promise().done(def.resolve).fail(def.reject).progress(def.notify);
								} else {
									def.notifyWith(this === promise ? def.promise() : this, [returnval]);
								}
							}.bind(that));
						}
						else {
							deferred.progress(def.notify);
						}
					});
				});
                
                return newDef.promise();
			},
            
            getContext: function() {
                return context;
            },
            
            getId: function() {
                return thisId;
            }
		},

		deferred = {
			resolveWith: function(ctx) {
				if (status === 'pending') {
					status = 'resolved';
					var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
					for (var i = 0; i < doneFuncs.length; i++) {
						doneFuncs[i].apply(ctx, args);
					}
				}
                
                // context = ctx;                
                
				return this;
			},

			rejectWith: function(ctx) {
				if (status === 'pending') {
					status = 'rejected';
					var args = resultArgs = (arguments.length > 1) ? arguments[1] : [];
					for (var i = 0; i < failFuncs.length; i++) {
						failFuncs[i].apply(ctx, args);
					}
				}
                
                // context = ctx;                
                
				return this;
			},

			notifyWith: function(ctx) {
				var args;
                
                if (status === 'pending') {                
                    args = lastNotify = (arguments.length > 1) ? arguments[1] : [];
                    for (var i = 0; i < progressFuncs.length; i++) {    
                        progressFuncs[i].apply(ctx, args);
                    }
                    
                    // context = ctx;
                }
                
				return this;
			},

			resolve: function() {
				var ret = deferred.resolveWith(this === deferred ? promise : this, arguments);
                return this !== deferred ? this : ret;
			},

			reject: function() {
				var ret = deferred.rejectWith(this === deferred ? promise : this, arguments);
                return this !== deferred ? this : ret;                    
			},

			notify: function() {
				var ret = deferred.notifyWith(this === deferred ? promise : this, arguments);
                return this !== deferred ? this : ret;                    
			}
		}

        promise.then = promise.pipe;
                    
		var obj = promise.promise(deferred);
        
        context = obj;
        
        obj.id = deferred.id = thisId;

		if (fn) {
			fn.apply(obj, [obj]);
		}
        
		return obj;
	};

	D.when = function() {
		if (arguments.length < 2) {
			var obj = arguments.length ? arguments[0] : undefined;
			if (obj && (typeof obj.isResolved === 'function' && typeof obj.isRejected === 'function')) {
				return obj.promise();			
			}
			else {
				return D().resolveWith(window, [obj]).promise();
			}
		}
		else {
			return (function(args){
				var df = D(),
					size = args.length,
					done = 0,
					rp = new Array(size),	// resolve params: params of each resolve, we need to track down them to be able to pass them in the correct order if the master needs to be resolved
                    pp = new Array(size),
                    whenContext = [];

				for (var i = 0; i < args.length; i++) {
                    whenContext[i] = args[i] && args[i].promise ? args[i].promise() : undefined;
					(function(j) {
                        var obj = null;
                        
                        if (args[j].done) {
                            args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(whenContext, rp); }})
                            .fail(function() { df.reject.apply(whenContext, arguments); });
                        } else {
                            obj = args[j];
                            args[j] = new Deferred();
                            
                            args[j].done(function() { rp[j] = (arguments.length < 2) ? arguments[0] : arguments; if (++done == size) { df.resolve.apply(whenContext, rp); }})
                            .fail(function() { df.reject.apply(whenContext, arguments); }).resolve(obj);
                        }
                        
                        args[j].progress(function() {
                            pp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                            df.notify.apply(whenContext, pp);
                        });
					})(i);
				}

				return df.promise();
			})(arguments);
		}
	}
    
    return D;
})({});