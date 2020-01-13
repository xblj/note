import React, { useState, useEffect } from 'react';
import store from './store';

export default function Counter() {
  const [state, setState] = useState(store.getState().counter1);

  function increment() {
    store.dispatch({
      type: 'INCREMENT1',
    });
  }

  function decrement() {
    store.dispatch({
      type: 'DECREMENT1',
    });
  }

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newState = store.getState().counter1;
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
