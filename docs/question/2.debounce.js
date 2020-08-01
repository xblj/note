/**
 * @param {function} fn
 * @param {number} 节流时间
 */
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  };
}

function fn(a) {
  console.log(a);
}

const debounceFn = debounce(fn, 1000);
debounceFn(1);
debounceFn(1);
setTimeout(() => {
  debounceFn(1);
}, 1500);
