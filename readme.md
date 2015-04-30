# gen-seq
Wrap a bunch of async operations into one function and iterate each step seamlessly returning
a promise resolving with the end returned value. If an error is throw along the way or a yield promise
fails then the promise rejects allowing you to catch the error.

# Installation
```bash
$ npm install gen-seq
```

# Usage
```javascript
var seq = require('./')
seq(function * () {
  var res1 = yield Promise.resolve('abc')
  return yield Promise.resolve(res1)
}).then(function (res) {
  res // => 'abc'
})

// you can also yield regular values
seq(function * () {
  var res1 = yield 'abc'
  return yield res1
}).then(function (res) {
  res // => 'abc'
})

// you can pass in the function context and parameters
var ctx = {}
function * gen(a, b, c) {
  this // => ctx
  return yield ['a', 'b', 'c']
}

seq.call(ctx, gen, 'a', 'b', 'c')
.then(function (abc) {
  abc // => ['a', 'b', 'c']
})

// if an error is throwm then the chain ends there
var error = new Error()
return seq(function * () {
  throw error
})
.catch(function (err) {
  err // => error
})

//  if a promise is rejected then the chain ends there
var error = new Error()
return seq(function * () {
  yield Promise.reject(error)

  // this is never reached
  return 'abc'
})
.catch(function (err) {
  err // => error
})
  
// a generator can also be yielded
function * g() {
  return yield Promise.resolve('abc')
}
return seq(function * () {
  var a = yield * g()
  t.equals(a, 'abc')
})

// finally you can even nest seq calls inside one another
function * g(abc) {
  return yield Promise.resolve(abc)
}

return seq(function * () {
  return yield seq(g, 'abc')
})
.then(function (res) {
  res // => 'abc'
})
```
