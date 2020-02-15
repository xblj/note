# redux 实现原理

本文重点在于如何实现`redux`，所以不会讲如何使用

## 基本概念和 API

- action

  > 描述提交到 `store` 的数据对象，该对象会传给 `reducer`， `reducer` 会根据`action.type`对`store`的数据进行不同的处理

  ```js
  const action = {
    // type是必须要有的
    type: 'add',
    // 可选，可以是任意字段
    payload: 1,
  };
  ```

- reducer

  > 数据的处理函数，接受`store`的当前状态，返回新的状态

  ```js
  function reducer(state = { count: 0 }, action) {
    switch (action.type) {
      case 'increment':
        state.count += action.payload;
      case 'decrement'
      state.count -= action.payload
    }

    return {...state}
  }
  ```

- Store

  > 用于存储数据，并提供一些 api 供使用者调用，获取：

  ```js
  const store = createStore(reducer);
  ```

- dispatch

  > 用于将`action`传递给`reducer`，调用`reducer`计算下一次的`store`，触发所有的监听函数

  ```js
  store.dispatch(action);
  ```

- subscribe

  > 用于订阅`store`的变化，如果`store`的状态改变了，那个就会以此运行订阅函数，其实是只要调用`store.dispatch`就会运行所有的监听函数

  ```js
  store.subscribe(() => {
    console.log('store 改变了');
  });
  ```

- state

  > `store`存储的值，整个应用的数据中心

  ```js
  const state = store.getState();
  ```

- actionCreator

  > 一个函数，返回一个`action`，用于快速创建一个 `action`，提高复用性

  ```js
  function increment(payload) {
    return {
      type: 'INCREMENT',
      payload,
    };
  }
  ```

- replaceReducer

> 用于替换当前的 reducer

## 实现

- 项目结构

```
|-- root
    |-- actionTypes.js // 内部action
    |-- applyMiddleware.js // 组合中间件，生成一个中间件函数
    |-- bindActionCreators.js // 将多个actionCreator格式化为一个对象
    |-- compose.js // 工具函数，组合中间件
    |-- createStore.js  // 创建store，对完提供操作store的api
```

- 实现

1. actionTypes

   > 内部 `action`

<<< @/source/react/redux/actionTypes.js

1. compose

   > 组合多个函数为一个函数，然后按照从右往左的顺序依次调用函数，上一个函数的返回值会作为下一函数的实参传入函数，主要用于组合中间件

   <<< @/source/react/redux/compose.js

   用法说明：

   ```js
   function fn1(arg) {
     console.log('fn1', arg);
     return 'result1';
   }
   function fn2(arg) {
     console.log('fn2', arg);
     return 'result2';
   }
   function fn3(arg) {
     console.log('fn3', arg);
     return 'result3';
   }

   const c = compose(fn1, fn2, fn3);
   const res = c(1);
   // fn3 1
   // fn2 result3
   // fn1 result2
   console.log(res);
   // fn1 result1
   ```

2. [createStore](/react/redux/createStore.html)

3. [combineReducers](/react/redux/combineReducers.html)

4. [bindActionCreators](/react/redux/bindActionCreators.html)
