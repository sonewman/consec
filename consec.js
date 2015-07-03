module.exports = consec

function call_(fn, ctx, args) {
  switch (args.length) {
    case 0: return fn.call(ctx);
    case 1: return fn.call(ctx, args[0]);
    case 2: return fn.call(ctx, args[0], args[1]);
    case 3: return fn.call(ctx, args[0], args[1], args[2]);
    default: return fn.apply(ctx, args);
  }
}

function isThenable(v) {
  return 'function' === typeof v.then
}

function consec(fn /*, arguments */) {
  var isIterator = 'function' === typeof fn.next
  if ('function' !== typeof fn && !isIterator)
    throw new TypeError('fn must be a generator or iterable')

  if (!isIterator) {
    var ctx = this
    var l = arguments.length
    var args = new Array(l - 1)
    for (var i = 1; i < l; i += 1)
      args[i - 1] = arguments[i]
  }

  return new Promise(function (resolve, reject) {
    if (isIterator) next(fn)
    else next(call_(fn, ctx, args))

    function fail(err) {
      reject(err)
    }

    function next(g, v) {
      var res = g.next(v)
      var value = res.value

      function cont(r) {
        next(g, r)
      }

      if (res.done) resolve(value)
      else if (isThenable(value)) value.then(cont, fail)
      else res.done ? resolve(value) : next(g, value)
    }
  })
}
