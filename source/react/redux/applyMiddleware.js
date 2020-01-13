import compose from './compose';

export default function applyMiddleware(...middlewares) {
  return createStore => (reducer, ...args) => {
    const store = createStore(reducer, ...args);
    let dispatch = function() {
      throw new Error('构建中间件中，不能调用dispatch');
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
