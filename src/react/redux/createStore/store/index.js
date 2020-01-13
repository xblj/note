import { createStore } from 'source/react/redux';

function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      state.count++;
      break;
    case 'DECREMENT':
      state.count--;
      break;
  }
  return { ...state };
}

const store = createStore(counter);

export default store;
