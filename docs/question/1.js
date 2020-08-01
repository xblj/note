const arr = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];

/**
 * 展平数组
 * @param {number[]} array
 */
function flatten(array) {
  let temp = array;
  while (temp.some(Array.isArray)) {
    temp = [].concat(...temp);
  }
  return temp;
}

/**
 * 计数排序加去重
 * @param {number[]} array
 */
function countSort(array) {
  const max = Math.max.apply(null, array);
  const min = Math.min.apply(null, array);
  const d = max - min;
  const countArray = Array(d + 1).fill(0);
  array.forEach((num) => {
    countArray[num - min]++;
  });

  return countArray.reduce((sorted, current, index) => {
    if (current > 0) {
      sorted.push(index + min);
    }
    return sorted;
  }, []);
}

function sort(array) {
  let temp = flatten(array);
  return countSort(temp);
}

const res = sort(arr);
console.log(res);
