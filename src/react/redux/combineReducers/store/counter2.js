export default function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT2':
      state.count++;
      break;
    case 'DECREMENT2':
      state.count--;
      break;
  }
  return { ...state };
}
