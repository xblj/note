// 如果我们要实现两个计数器
function reducer(state, action) {
  switch (action.type) {
    case 'increment1':
      return {
        ...state,
        counter1: {
          count: state.counter1.count + 1,
        },
      };
    case 'increment2':
      return {
        ...state,
        counter2: {
          count: state.counter2.count + 1,
        },
      };
    case 'decrement1':
      return {
        ...state,
        counter1: {
          count: state.counter1.count - 1,
        },
      };
    case 'decrement2':
      return {
        ...state,
        counter2: {
          count: state.counter2.count - 1,
        },
      };
  }
}
