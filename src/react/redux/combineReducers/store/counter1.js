export default function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT1':
      state.count++;
      break;
    case 'DECREMENT1':
      state.count--;
      break;
  }
  return { ...state };
}
