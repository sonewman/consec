module.exports = consec

var slice = Array.prototype.slice

function isThenable(v) {
  return 'function' === typeof v.then
}

function consec(fn /*, arguments */) {
  var ctx = this
  var args = slice.call(arguments, 1)

  return new Promise(function (resolve, reject) {
    var gen = fn.apply(ctx, args)
    next(gen)

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
