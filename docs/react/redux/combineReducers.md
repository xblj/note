# redux 全解析（二） combineReducers

- 有什么用？

1. 用于组合多个 `reducer`

2. 通过实现的[createStore](/react/redux/createStore)，我们知道，`createStore(reducer, state)`只能接受一个`reducer`，如果我们所有的逻辑都写在这一个`reducer`里面，一旦逻辑多了，那么必然难以维护。比如：

<<< @/docs/react/redux/withoutCombineReducers.js

为了解决上面提到的问题，我们需要拆分`reducer`到不同的文件，各个文件独立的管理自己的`state`，能达到如下的。

> ./store/counter1.js

<<< @/src/react/redux/combineReducers/store/counter1.js

> ./store/counter2.js

<<< @/src/react/redux/combineReducers/store/counter2.js

> ./store/reducer.js

<<< @/src/react/redux/combineReducers/store/reducer.js

> ./store/index.js

<<< @/src/react/redux/combineReducers/store/index.js

- 实现

  <<< @/source/react/redux/combineReducers.js
