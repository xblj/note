const bindActionCreator = (actionCreator, dispatch) => (...args) =>
  dispatch(actionCreator(...args));

/**
 *
 * @param {Function | {[key:string]:Function}} actionCreator
 * @param {Function} dispatch
 */
export default function bindActionCreators(actionCreator, dispatch) {
  const creatorType = typeof actionCreator;
  if (creatorType === 'function') {
    return bindActionCreator(actionCreator, dispatch);
  }

  if (creatorType === 'object' && actionCreator !== null) {
    return Object.keys(actionCreator).reduce((memo, key) => {
      memo[key] = bindActionCreator(actionCreator[key], dispatch);
      return memo;
    }, {});
  }
}
