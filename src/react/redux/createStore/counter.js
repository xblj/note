import React, { useState, useEffect } from 'react';
import store from './store';

export default function Counter() {
  const [state, setState] = useState(store.getState());

  function increment() {
    store.dispatch({
      type: 'INCREMENT',
    });
  }

  function decrement() {
    store.dispatch({
      type: 'DECREMENT',
    });
  }

  function replaceReducer() {
    const newStore = store.replaceReducer(function counter2(
      state = { count: 0 },
      action
    ) {
      switch (action.type) {
        case 'INCREMENT':
          state.count += 2;
          break;
        case 'DECREMENT':
          state.count -= 2;
          break;
      }
      return { ...state };
    });
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
      <button onClick={replaceReducer}>replace reducer</button>
    </div>
  );
}
