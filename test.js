var desc = require('macchiato')
var consec = require('./')

desc('consec(function * () { })')
.it('should take a generator and iterate on it, return resolved promises values', function (t) {
  return consec(function * () {
    var res1 = yield Promise.resolve('a')
    t.equals(res1, 'a')
    var res2 = yield Promise.resolve('b')
    t.equals(res2, 'b')
    var res3 = yield Promise.resolve('c')
    t.equals(res3, 'c')
    return yield Promise.resolve('blah')
  }).then(function (res) {
    t.equals(res, 'blah')
  })
})
.it('should take a generator and iterate regular values', function (t) {
  return consec(function * () {
    var res1 = yield 'a'
    t.equals(res1, 'a')
    var res2 = yield 'b'
    t.equals(res2, 'b')
    var res3 = yield 'c'
    t.equals(res3, 'c')

    return yield 'blah'
  }).then(function (res) {
    t.equals(res, 'blah')
  })
})
.it('should allow generator to be called with context and arguments', function (t) {
  var ctx = {}
  return consec.call(ctx, function * (a, b, c) {
    t.equals(ctx, this)
    t.equals(a, 'a')
    t.equals(b, 'b')
    t.equals(c, 'c')
  }, 'a', 'b', 'c')
})
.it('should fail if error is thrown', function (t) {
  var error = new Error()
  return consec(function * () {
    throw error
  })
  .then(function () {
    t.fail()
  })
  .catch(function (err) {
    t.equals(err, error)
    t.pass()
  })
})
.it('should fail if yielded promise fails', function (t) {
  var error = new Error()
  return consec(function * () {
    yield Promise.reject(error)
    return 'abc'
  })
  .then(function () {
    t.fail()
  })
  .catch(function (err) {
    t.equals(err, error)
    t.pass()
  })
})
.it('should yield a generator returning it\'s promise', function (t) {
  function * g() {
    var a = yield Promise.resolve('abc')
    return a
  }
  return consec(function * () {
    var a = yield * g()
    t.equals(a, 'abc')
  })
})
.it('should allow nesting of consec', function (t) {
  function * g(abc) {
    return yield Promise.resolve(abc)
  }

  return consec(function * () {
    return yield consec(g, 'abc')
  })
  .then(function (res) {
    t.equals(res, 'abc')
  })
})
