/** 
 * 作者：阳光是sunny
 * 链接：https://juejin.cn/post/6856213486633304078
 * 来源：稀土掘金
 * 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 * 
 * Promise核心原理 
 * 
 * 1.整体结构
 * 2.实现promise构造函数
 * 3.实现then方法
 * 4.实现catch方法
 * 5.实现promise.resolve
 * 6.实现promise.reject
 * 7.实现promise.all
 * 8.实现promise.race
 * */


/* shift+option+A : 块注释 */
// 1=======================================================================================================================

// 写出构造函数，将Promise向外暴露
(function(window) {
  // Promise构造函数
  // executor: 执行器函数
  function Promise(executor) {

  }
  // 向外暴露Promise
  window.Promise = Promise
})()

//添加Promise原型对象上的方法
/* 
Promise的原型对象的then方法
指定一个成功和失败的回调函数
返回一个新的Promise对象
Promise原型对象的.catch
指定一个失败的回调函数
*/
Promise.prototype.then = function (onResolved, onRejected) {
  //如果传入的不是函数，那就忽略那个传入值，自己再写一个函数。这个函数的执行结果将返回上一个promise的data
  onResolved = typeof onResolved === 'function'? onResolved: value => value
  onRejected = typeof onRejected === 'function'? onRejected: reason => {throw reason}
  var self = this

  return new Promise((resolve, reject) => {

    /*
      调用指定回调函数的处理，根据执行结果。改变return的promise状态
    */
    function handle(callback) {
      try {
        const result = callback(self.data)
        if (result instanceof Promise) {
          // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
          result.then(
            value => { resolve(value) },
            reason => { reject(reason) }
          )
        } else {
          // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
          resolve(result)
        }
      } catch (e) {
        //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
        reject(e)
      }
    }

    if (self.status === 'pending') {
      // promise当前状态还是pending状态，将回调函数保存起来
      self.callbacks.push({
        // onResolved() { onResolved(self.data) },
        // onRejected() { onRejected(self.data) }

        onResolved() {
          handle(onResolved)
          // try {
          //   const result = onResolved(self.data)
          //   if (result instanceof Promise) {
          //     // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
          //     result.then(
          //       value => { resolve(value) },
          //       reason => { reject(reason) }
          //     )
          //   } else {
          //     // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
          //     resolve(result)
          //   }
          // } catch (e) {
          //   //  3.如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
          //   reject(e)
          // }
        },
        onRejected() {
          handle(onRejected)
        }
      })

    } else if (self.status === 'resolved') {
      修改代码
      setTimeout(() => {
        //执行onResolved(self.data)，其实就是执行value => {return value}
        //执行完then是要返回一个新的promise的，而新的promise的状态则由当前then的执行结果来确定
        //当前的promise状态为resolved的时候，则执行then的时候，会执行第二个判断语句的时候会出现三种情况
        //====这个回调函数返回了value。就把value传入resolve函数，resolve函数将当前新的promise的状态改为resolved，同时将value保存到当前新的promise的data中
        //====如果回调函数返回的是promise，return的promise的结果就是这个promise的结果，如代码所示，我们返回一个新的promise。如果这个promise执行了resolve，返回的新的promise的状态则是resolved的。否则为rejected
        //====如果执行这段代码的时候抛出错误，则返回的promise的状态为rejected，我们可以用try catch来实现
        // try{
        //   const result = onResolved(self.data)
        //   if (result instanceof Promise) {
        //     // 2. 如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
        //     result.then(
        //       value => {resolve(value)},
        //       reason => {reject(reason)}
        //     )
        //   } else {
        //     // 1. 如果回调函数返回的不是promise，return的promise的状态是resolved，value就是返回的值。
        //     resolve(result)
        //   }
        // }catch(e) {
        //   //3. 如果执行onResolved的时候抛出错误，则返回的promise的状态为rejected
        //   reject(e)
        // }
        handle(onResolved)
      })
    } else {
      setTimeout(() => {
        // onResolved(self.data)
        handle(onRejected)
      })
    }
  })
}

//执行.then方法
//1、then里的回调函数返回的不是promise
let promise1 = new Promise((resolve,reject)=>{
  resolve(1)
})

promise.then(
  value=>{
      return value //返回的不是promise，是value
  }
)

//2、如果回调函数返回的是promise，return的promise的结果就是这个promise的结果
let promise2 = new Promise((resolve,reject)=>{
  resolve(1)
})

promise.then(
  value=>{
      return new Promise((resolve,reject)=>{
          resolve(2)
          //或者
          //reject(error)
      })
  }
)

//

//值穿透
//.then 或者 .catch 的参数期望是函数，传入非函数则会发生值穿透。值传透可以理解为，当传入then的不是函数的时候，这个then是无效的。
//而实际原理上其实是当then中传入的不算函数，则这个then返回的promise的data，将会保存上一个的promise.data。这就是发生值穿透的原因。
//而且每一个无效的then所返回的promise的状态都为resolved
let promsie = new Promise((resolve,reject)=>{
  resolve(1)
})
promsie
.then(2)
.then(3)
.then(value =>console.log(value))

//catch方法的作用跟then里的第二歌回调函数一样，因此我们可以这样来实现============================================================
Promise.prototype.catch = function(onRejected) {
  return this.then(undefined,onRejected)
}

//添加Promise函数对象上的方法
/* Promise
resolve: 指定结果的promise对象
reject: 指定reason的失败状态的promise对象
all: 只有当所有promise都成功时返回的promise状态才成功
race: 状态由第一个完成的promise决定
执行结果都将返回一个Promise对象
*/

//Promise.resolve方法可以传三种值： 
//（1）不是Promise
//（2）成功状态的Promise
//（3）失败状态的Promise
Promise.resolve = function (value) {
  // 如果当前状态不是pending，则不执行
  if (this.status !== 'pending') {
    return
  }
  // 将状态改为resolved
  this.status = 'resolved'
  // 保存value的值
  this.data = value

  // 如果有待执行的callback函数，立即异步执行回调函数onResolved
  if (this.callbacks.length > 0) {
    setTimeout(() => {
      this.callbacks.forEach(callbackObj => {
        callbackObj.onResolved(value)
      })
    })
  }

}

Promise.reject = function (value) {
  // 如果当前状态不是pending，则不执行
  if (self.status !== 'pending') {
    return
  }
  // 将状态改为rejected
  self.status = 'rejected'
  // 保存value的值
  self.data = value

  // 如果有待执行的callback函数，立即异步执行回调函数onResolved
  if (self.callbacks.length > 0) {
    self.callbacks.forEach(callbackObj => {
      callbackObj.onRejected(value)
    })
  }

}

/*
  Promise函数对象的all方法
  返回一个promise对象，只有当所有promise都成功时返回的promise状态才成功
*/

//all传进去的数组不一定都是promise对象，需要把不是promise的数字包装成promise
//1. 遍历到有一个promise是reject状态，则直接返回的promise状态为rejected
//2. 遍历所有的promise的状态都为resolved,则返回的promise状态为resolved，并且还要每个promise产生的值传递下去
Promise.all = function(promises) {
  const values = new Array(promises.length)
  var resolvedCount = 0 //计状态为resolved的promise的数量
  return new Promise((resolve,reject)=>{
    // 遍历promises，获取每个promise的结果
    promises.forEach((p,index)=>{  
      Promise.resolve(p).then(
        value => {
            // p状态为resolved，将值保存起来
            values[index] = value
            resolvedCount++;
            // 如果全部p都为resolved状态，return的promise状态为resolved
            if(resolvedCount === promises.length){
                resolve(values)
            }
        },
        reason => { //只要有一个失败，return的promise状态就为reject
            reject(reason)
        }
      )
    })
  })
}

/*
  Promise函数对象的race方法
  返回一个promise对象，状态由第一个完成的promise决定
*/
Promise.race = function (value) {
  return new Promise((resolve, reject) => {
    // 遍历promises，获取每个promise的结果
    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        value => {
          // 只要有一个成功，返回的promise的状态九尾resolved
          resolve(value)

        },
        reason => { //只要有一个失败，return的promise状态就为reject
          reject(reason)
        }
      )
    })
  })
}

//2=============================================================================================================
function Promise(executor) {
  var self = this
  self.stuts = "pending"  // 给promise对象指定status属性，初始值为pending
  self.data = undefined   // 给promise对象指定一个存储结果的data
  self.callbacks = []     // 每个元素的结构：{onResolved(){}，onRejected(){}}
  function resolve() {

  }
  function reject() {

  }
  try {
    // 立即同步执行executor
    executor(resolve, reject)
  } catch (e) { // 如果执行器抛出异常，promise对象变为rejected状态
    reject(e)
  }
}

var promise = new Promise((resovle,reject)=>{
    
})
//这时执行到then，因为我们传入的立即执行函数没有执行resolve或者reject，所以promise的状态还是pending，这时要把then里面的回调函数保存起来，所以需要个callbacks数组
promise.then(resolve=>{},reject=>{})

