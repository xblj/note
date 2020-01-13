import { createStore, applyMiddleware } from 'source/react/redux';

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

function logger({ getState }) {
  return next => action => {
    console.group(`action: ${action.type}`);
    console.log('will dispatch', action);
    const returnValue = next(action);
    console.log('state after dispatch', getState());
    console.groupEnd();
    return returnValue;
  };
}

const store = createStore(counter, { count: 1 }, applyMiddleware(logger));

export default store;
