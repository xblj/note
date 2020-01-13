/**
 * 将多个reducer合并为一个reducer
 */
export default function combineReducers(reducers) {
  const finalReducers = { ...reducers };

  return function combination(state = {}, action) {
    // 下一次的状态
    const nextState = {};
    // 标记state是否有更改
    let hasChanged = false;

    // 遍历所有的reducer，以此执行
    Object.keys(finalReducers).forEach(key => {
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      // 检测是否有更改，这里是一个浅比较，所以每次调用reducer有更改的时候都必须返回一个全新的对象，而不能只改动某一个属性
      hasChanged = nextStateForKey !== previousStateForKey;
    });
    // 如果每个reducer返回没有更改过state，那么需要判断下，是否有新增reducer
    hasChanged =
      hasChanged || finalReducers.length !== Object.keys(state).length;

    // 没有更改过任何值，直接返回老状态
    return hasChanged ? nextState : state;
  };
}
