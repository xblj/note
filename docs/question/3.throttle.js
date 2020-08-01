/**
 *
 * @param {function} func
 * @param {number} wait
 */
function throttle(func, wait) {
  let previous = 0;

  return function(...args) {
    const now = Date.now();
    let context = this;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}

/**
 *
 * @param {function} func
 * @param {number} wait
 */
function throttle2(func, wait) {
  let timer = null;
  return function(...args) {
    let context = this;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, wait);
    }
  };
}

/**
 *
 * @param {function} func
 * @param {number} wait
 */
function throttle3(func, wait) {
  let timer;
  let context;
  let args;
  let previous = 0;

  let later = function() {
    previous = Date.now();
    timer = null;
    func.apply(context, args);
  };

  const throttled = function(...params) {
    args = params;
    let now = Date.now();
    const remaining = wait - (now - previous);
    context = this;
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timer) {
      timer = setTimeout(later, remaining);
    }
  };

  return throttled;
}

function throttle4(func, wait, options) {
  var timeout, context, args;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  var throttled = function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}
