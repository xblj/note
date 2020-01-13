# redux 全解析（三） bindActionCreators

- 有什么用？

  1. 快速创建`action`
  2. 简化数据提交

一般我们在提交`action`时，并不会直接直接将一个对象传递给`dispatch`，而是调用一个函数生成`action`，再传递给`dispatch`。

```js
// bad, 这样书写有很多不好的地方
// 1. 重复书写，多个地方用到了，每个地方都需要写一个action
// 2. 不理解后期修改，比如需要将'INCREMENT'改为'INCREMENT_TWO'
dispatch({
  type: 'INCREMENT',
  payload: 1,
});

dispatch({
  type: 'INCREMENT',
  payload: 1,
});

// GOOD
function increment(payload) {
  return {
    type: 'INCREMENT',
    payload,
  };
}

dispatch(increment(1));
dispatch(increment(1));
dispatch(increment(1));
```

我们使用 actionCreator 来生成 action，bindActionCreators 可以让我进一步简化提交，使用如下：

<<< @/src/react/redux/bindActionCreator/App.js

- 实现

<<< @/source/react/redux/bindActionCreators.js
