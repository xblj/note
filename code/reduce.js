Array.prototype.reduce = function (callBack, initial) {
  if (initial == undefined && !this.length) {
    throw new Error('Reduce of empty array with no initial value')
  }
  let prev;
  this.forEach((item, index, array) => {
    if (index === 0) {
      prev = initial || item;
      if (initial === undefined) return;
    }

    prev = callBack(prev, item, index, array)

  })
  return prev;
};

Array.prototype.flat = function (depth) {
  let curDepth = 1;
  return this.reduce(function _flat(prev, cur) {
    if (Array.isArray(cur)) {
      if (curDepth <= depth) {
        curDepth++;
        return cur.reduce(_flat, prev)
      } else {
        prev.push(cur)
      }
    } else {
      prev.push(cur);
    }
    return prev;
  }, [])
}

let arr1 = [1, , [2, [3, [4]]]];

console.log(arr1.flat(2));


// let res = [].reduce((prev, cur) => {
//   console.log(prev);
//   return prev + cur
// })
// console.log(res);
