/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/spromise
 */

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

/*global process, setImmediate*/
define('src/async',['require','exports','module'],function(require, exports, module) {
  

  var nextTick;

  function Async(cb) {
    nextTick(cb);
  }

  Async.delay = function(callback, timeout, args) {
    setTimeout(callback.apply.bind(callback, this, args || []), timeout);
  };


  /**
   * Find the prefered method for queue callbacks in the event loop
   */

  if (typeof(process) === "object" && typeof(process.nextTick) === "function") {
    nextTick = process.nextTick;
  }
  else if (typeof(setImmediate) === "function") {
    nextTick = setImmediate;
  }
  else {
    nextTick = function(cb) {
      setTimeout(cb, 0);
    };
  }

  Async.nextTick = nextTick;
  module.exports = Async;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

define('src/promise',['require','exports','module','src/async'],function(require, exports, module) {
  

  var async = require("src/async");

  var states = {
    "pending"  : 0,
    "resolved" : 1,
    "rejected" : 2,
    "always"   : 3,
    "notify"   : 4
  };

  var strStates = [
    "pending",
    "resolved",
    "rejected"
  ];

  /**
   * Small Promise
   */
  function Promise(resolver, stateManager) {
    stateManager = stateManager || new StateManager();
    var target = this;

    target.then = function(onResolved, onRejected) {
      return stateManager.then(onResolved, onRejected);
    };

    target.resolve = function() {
      stateManager.transition(states.resolved, arguments, this);
      return target;
    };

    target.reject = function() {
      stateManager.transition(states.rejected, arguments, this);
      return target;
    };

    // Read only access point for the promise.
    target.promise = {
      then   : target.then,
      always : target.always,
      done   : target.done,
      catch  : target.fail,
      fail   : target.fail,
      notify : target.notify,
      state  : target.state,
      constructor : Promise // Helper to detect spromise instances
    };

    // Make sure we have a proper promise reference
    target.promise.promise = target.promise;

    // Let's make the state manager available for now.
    target.then.stateManager = stateManager;

    // Interface to allow to post pone calling the resolver as long as its not needed
    if (resolver) {
      resolver.call(target, target.resolve, target.reject);
    }
  }

  Promise.prototype.done = function(cb) {
    this.then.stateManager.enqueue(states.resolved, cb);
    return this.promise;
  };

  Promise.prototype.catch = Promise.prototype.fail = function(cb) {
    this.then.stateManager.enqueue(states.rejected, cb);
    return this.promise;
  };

  Promise.prototype.finally = Promise.prototype.always = function(cb) {
    this.then.stateManager.enqueue(states.always, cb);
    return this.promise;
  };

  Promise.prototype.notify = function(cb) {
    this.then.stateManager.enqueue(states.notify, cb);
    return this.promise;
  };

  Promise.prototype.state = function() {
    return strStates[this.then.stateManager.state];
  };

  Promise.prototype.isPending = function() {
    return this.then.stateManager.state === states.pending;
  };

  Promise.prototype.isResolved = function() {
    return this.then.stateManager.state === states.resolved;
  };

  Promise.prototype.isRejected = function() {
    return this.then.stateManager.state === states.resolved;
  };

  Promise.prototype.delay = function delay(ms) {
    var _self = this;
    return new Promise(function(resolve, reject) {
      _self.then(function() {
        async.delay(resolve.bind(this), ms, arguments);
      }, reject.bind(this));
    });
  };

  /**
   * Provides a set of interfaces to manage callback queues and the resolution state
   * of the promises.
   */
  function StateManager(options) {
    // Initial state is pending
    this.state = states.pending;

    // If a state is passed in, then we go ahead and initialize the state manager with it
    if (options && options.state) {
      this.transition(options.state, options.value, options.context);
    }
  }

  /**
   * Figure out if the promise is pending/resolved/rejected and do the appropriate
   * action with the callback based on that.
   */
  StateManager.prototype.enqueue = function (state, cb) {
    if (!this.state) {
      (this.queue || (this.queue = [])).push(TaskAction);
    }
    else {
      // If the promise has already been resolved and all its queue has
      // been processed, then we need to schedule the new task for processing
      // ASAP by putting in the asyncQueue
      TaskManager.asyncTask(TaskAction);
    }

    var stateManager = this;
    function TaskAction() {
      // If not pending, then lets execute the callback
      if (stateManager.state === state || states.always === state) {
        cb.apply(stateManager.context, stateManager.value);
      }
      // Do proper notify events
      else if (states.notify === state) {
        cb.call(stateManager.context, stateManager.state, stateManager.value);
      }
    }
  };

  /**
   * Transitions the state of the promise from pending to either resolved or
   * rejected.  If the promise has already been resolved or rejected, then
   * this is a noop.
   */
  StateManager.prototype.transition = function (state, value, context) {
    if (this.state) {
      return;
    }

    this.state   = state;
    this.context = context;
    this.value   = value;

    var queue = this.queue;
    if (queue) {
      this.queue = null;
      TaskManager.asyncTask(TaskManager.taskRunner(queue));
    }
  };

  // 2.2.7: https://promisesaplus.com/#point-40
  StateManager.prototype.then = function(onResolved, onRejected) {
    var stateManager = this;

    // Make sure onResolved and onRejected are functions, or null otherwise
    onResolved = (onResolved && typeof(onResolved) === "function") ? onResolved : null;
    onRejected = (onRejected && typeof(onRejected) === "function") ? onRejected : null;

    // 2.2.7.3 and 2.2.7.4: https://promisesaplus.com/#point-43
    // If there are no onResolved or onRejected callbacks and the promise
    // is already resolved, we just return a new promise and copy the state
    if ((!onResolved && stateManager.state === states.resolved) ||
        (!onRejected && stateManager.state === states.rejected)) {
      return new Promise(null, stateManager);
    }

    return new Promise(function(resolve, reject) {
      var promise    = this,
          hasHandler = !!(onResolved || onRejected);

      // Run the notification task async if there is a handler or promise1 has
      // not yet been resolved.  Otherwise, run the task sync.
      stateManager.enqueue(states.notify, NotifyAction);

      // Callback when the promise is ready
      function NotifyAction(state, value) {
        if (hasHandler) {
          var handler = (state === states.resolved) ? (onResolved || onRejected) : (onRejected || onResolved);

          // Try catch in case calling the handler throws an exception
          try {
            value = handler.apply(this, value);
            value = value === (void 0) ? [] : [value];
          }
          catch(ex) {
            return reject.call(this, ex);
          }
        }

        if (value.length) {
          var resolution = new Resolution({promise: promise});
          resolution.finalize(state, value, this);
        }
        else if (state === states.resolved) {
          resolve.call(this);
        }
        else {
          reject.call(this);
        }
      }
    });
  };


  /**
   * Thenable resolution
   */
  function Resolution(options) {
    this.promise = options.promise;
  }


  /**
   * Chain DRYs resolvePromise and rejectPromise.
   * This chain is used when interoperating with in other promise implementations
   */
  Resolution.prototype.chain = function(state) {
    var resolution = this;
    return function chain() {
      if (!resolution.resolved) {
        resolution.resolved = true;
        resolution.finalize(state, arguments, this);
      }
    };
  };


  /**
   * Promise resolution procedure
   *
   * @param {states} state - Is the state of the promise resolution (resolved/rejected)
   * @param {context} context - Is that context used when calling resolved/rejected
   * @param {array} data - Is value of the resolved promise
   */
  Resolution.prototype.finalize = function(state, value, context) {
    var _self = this;
    var promise = this.promise,
        input   = value[0];

    try {
      // 2.3.1 https://promisesaplus.com/#point-48
      if (input === promise) {
        throw new TypeError("Resolution input must not be the promise being resolved");
      }

      // 2.3.2 https://promisesaplus.com/#point-49
      // if the incoming promise is an instance of spromise, we adopt its state
      if (input && input.constructor === Promise) {
        return input.notify(function NotifyDelegate(state, value) {
          _self.finalize(state, value, this);
        });
      }

      // 2.3.3 https://promisesaplus.com/#point-53
      // If thenable is function or object, then try to resolve using that.
      var then     = input && input.then,  // Reading `.then` could throw
          thenType = then && typeof(then) === "function" && typeof(input);

      // If we have a thennable, then we chain the resolution of the promise to it
      if (then && (thenType === "function" || thenType === "object")) {
        var resolution = new Resolution(this);
        try {
          return then.call(input, resolution.chain(states.resolved), resolution.chain(states.rejected));
        }
        catch (ex) {
          if (!resolution.resolved) {
            promise.reject.call(context, ex);
          }
        }
      }

      // 2.3.4 https://promisesaplus.com/#point-64
      // If x is not an object or function, fulfill promise with x
      else {
        if (state === states.resolved) {
          promise.resolve.apply(context, value);
        }
        else {
          promise.reject.apply(context, value);
        }
      }
    }
    catch (ex) {
      promise.reject.call(context, ex);
    }
  };

  var TaskManager = {
    _asyncQueue: [],
    asyncTask: function(task) {
      if (TaskManager._asyncQueue.push(task) === 1) {
        async(TaskManager.taskRunner(TaskManager._asyncQueue));
      }
    },
    taskRunner: function(queue) {
      return function taskRunner() {
        while(queue.length) {
          queue[0]();
          queue.shift();
        }
      };
    }
  };
  
  /**
   * Public interface to create promises
   */
  function Factory(resolver) {
    return new Promise(resolver);
  }

  // Enable type check with instanceof
  Factory.prototype = Promise.prototype;

  /**
   * Interface to play nice with libraries like when and q.
   */
  Factory.defer = function () {
    return new Promise();
  };

  /**
   * Create a promise that's already rejected
   *
   * @returns {Promise} A promise that is alraedy rejected with the input value
   */
  Factory.reject = function () {
    return new Promise(null, new StateManager({
      context: this,
      value: arguments,
      state: states.rejected
    }));
  };

  /**
   * Interface that makes sure a promise is returned, regardless of the input.
   * 1. If the input is a promsie, then that's immediately returned.
   * 2. If the input is a thenable (has a then method), then a new promise is returned
   *    that's chained to the input thenable.
   * 3. If the input is any other value, then a new promise is returned and resolved with
   *    the input value
   *
   * @returns {Promise}
   */
  Factory.resolve = Factory.thenable = function (value) {
    if (value) {
      if (value instanceof(Promise) === true) {
        return value;
      }
      else if (typeof(value.then) === "function") {
        return new Promise(value.then);
      }
    }

    return new Promise(null, new StateManager({
      context: this,
      value: arguments,
      state: states.resolved
    }));
  };

  /**
   * Creates a promise that's resolved after ms number of milleseconds. All arguments passed
   * in to delay, with the excpetion of ms, will be used to resolve the new promise with.
   *
   * @param {number} ms - Number of milliseconds to wait before the promise is resolved.
   */
  Factory.delay = function delay(ms) {
    var args = Array.prototype.slice(arguments, 1);
    return new Promise(function(resolve) {
      async.delay(resolve.bind(this), ms, args);
    });
  };

  // Expose enums for the states
  Factory.states = states;
  module.exports = Factory;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

define('src/all',['require','exports','module','src/promise','src/async'],function(require, exports, module) {
  

  var Promise = require("src/promise"),
      Async   = require("src/async");

  function _result(input, args, context) {
    if (typeof(input) === "function") {
      return input.apply(context, args||[]);
    }
    return input;
  }

  function All(values) {
    values = values || [];

    // The input is the queue of items that need to be resolved.
    var resolutions = [],
        promise     = Promise.defer(),
        context     = this,
        remaining   = values.length;

    if (!values.length) {
      return promise.resolve(values);
    }

    // Check everytime a new resolved promise occurs if we are done processing all
    // the dependent promises.  If they are all done, then resolve the when promise
    function checkPending() {
      remaining--;
      if (!remaining) {
        promise.resolve.call(context, resolutions);
      }
    }

    // Wrap the resolution to keep track of the proper index in the closure
    function resolve(index) {
      return function() {
        resolutions[index] = arguments.length === 1 ? arguments[0] : arguments;
        checkPending();
      };
    }

    function processQueue() {
      var i, item, length;
      for (i = 0, length = remaining; i < length; i++) {
        item = values[i];
        if (item && typeof item.then === "function") {
          item.then(resolve(i), promise.reject);
        }
        else {
          resolutions[i] = _result(item);
          checkPending();
        }
      }
    }

    // Process the promises and callbacks
    Async(processQueue);
    return promise;
  }

  module.exports = All;
});


/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

define('src/when',['require','exports','module','src/promise','src/all'],function(require, exports, module) {
  

  var Promise = require("src/promise"),
      All     = require("src/all");

  /**
   * Interface to allow multiple promises to be synchronized
   */
  function When() {
    var context = this, args = arguments;
    return new Promise(function(resolve, reject) {
      All.call(context, args).then(function(results) {
        resolve.apply(context, results);
      },
      function(reason) {
        reject.call(context, reason);
      });
    });
  }

  module.exports = When;
});


/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

define('src/race',['require','exports','module','src/promise'],function(require, exports, module) {
  

  var Promise = require("src/promise");

  function Race(iterable) {
    if (!iterable) {
      return Promise.resolve();
    }

    return new Promise(function(resolve, reject) {
      var i, length, _done = false;
      for (i = 0, length = iterable.length; i < length; i++) {
        iterable[i].then(_resolve, _reject);
      }

      function _resolve() {
        if (!_done) {
          _done = true;
          resolve.apply(this, arguments);
        }
      }

      function _reject() {
        if (!_done) {
          _done = true;
          reject.apply(this, arguments);
        }
      }
    });
  }

  module.exports = Race;
});

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

define('src/spromise',['require','exports','module','src/promise','src/async','src/when','src/all','src/race'],function(require, exports, module) {
  

  var Promise  = require("src/promise");
  Promise.aync = require("src/async");
  Promise.when = require("src/when");
  Promise.all  = require("src/all");
  Promise.race = require("src/race");

  module.exports = Promise;
});

