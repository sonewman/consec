# consec
Wrap a bunch of async operations into one function and iterate each step `consecutively` seamlessly returning
a promise resolving with the end returned value. If an error is throw along the way or a yield promise
fails then the promise rejects allowing you to catch the error.

# Installation
```bash
$ npm install consec
```

# Usage
```javascript
var consec = require('consec')

consec(function * () {
  var res1 = yield Promise.resolve('abc')
  return yield Promise.resolve(res1)
}).then(function (res) {
  res // => 'abc'
})

// you can also yield regular values
consec(function * () {
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

consec.call(ctx, gen, 'a', 'b', 'c')
.then(function (abc) {
  abc // => ['a', 'b', 'c']
})

// if an error is throwm then the chain ends there
var error = new Error()
return consec(function * () {
  throw error
})
.catch(function (err) {
  err // => error
})

//  if a promise is rejected then the chain ends there
var error = new Error()
return consec(function * () {
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
return consec(function * () {
  var a = yield * g()
  t.equals(a, 'abc')
})

// finally you can even nest consec calls inside one another
function * g(abc) {
  return yield Promise.resolve(abc)
}

return consec(function * () {
  return yield consec(g, 'abc')
})
.then(function (res) {
  res // => 'abc'
})
```
