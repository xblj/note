const actionTypes = require('./actionTypes');

/**
 * 创建一个仓库
 * @param {Function} reducer
 * @param {Object<string, any>} preLoadedState
 */
export default function createStore(reducer, preLoadedState, enhancer) {
  let currentState = preLoadedState;
  let listeners = [];

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('中间件错误');
    }

    return enhancer(createStore)(reducer, preLoadedState);
  }

  /**
   * 获取当前的仓库状态
   */
  function getState() {
    return currentState;
  }

  /**
   * 订阅仓库的变化
   * @param {()=>void} listener
   */
  function subscribe(listener) {
    listeners.push(listener);
    // 取消订阅
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }

  /**
   * 替换当前的reducer
   * @param {Function} nextReducer
   */
  function replaceReducer(nextReducer) {
    reducer = nextReducer;
    dispatch({ type: actionTypes.REPLACE });
    return store;
  }

  /**
   * 提交数据到仓库中
   * @param {{type:string,[key:string]:any}} action
   */
  function dispatch(action) {
    currentState = reducer(currentState, action);
    listeners.forEach(listener => listener());
    return action;
  }

  // 初始化仓库
  dispatch({ type: actionTypes.INIT });

  const store = {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  };

  return store;
}
