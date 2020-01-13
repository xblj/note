import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'source/react/redux';
import store from './store';
// 导入所有的creator
import * as actionCreators from './store/createActions';
// 绑定creator
const boundActionCreators = bindActionCreators(actionCreators, store.dispatch);

export default function App() {
  const [state, setState] = useState(store.getState());

  function increment() {
    // 提交数据不需要再写dispatch
    boundActionCreators.increment(2);
  }

  function decrement() {
    // 提交数据不需要再写dispatch
    boundActionCreators.decrement(1);
  }

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newState = store.getState();
      setState(newState);
    });
    return unsubscribe;
  });

  return (
    <div>
      <div>{state.count}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
