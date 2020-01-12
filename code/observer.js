let arrayProto = Array.prototype;
let proto = Object.create(arrayProto);

['push', 'unshift', 'splice', 'reverse', 'sort', 'pop'].forEach(method => {
  proto[method] = (...args) => {
    console.log('update');
    let inserted;
    switch (method) {
      case 'puse':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args[2]
      default:
        break;
    }
    observer(inserted);
    arrayProto[method].call(this, ...args);
  }
});

function ArrayObserver(obj) {
  for (let i = 0; i < obj.length; i++) {
    let item = obj[i];
    // 如果是普通值 就不监控了
    observer(item); // 如果是对象会被 defineReactive
  }
}

function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    // 重写数组方法
    Object.setPrototypeOf(obj, proto);
    ArrayObserver(obj)
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      defineReactive(obj, key, obj[key]);
    }
  }
}

function defineReactive(obj, key, value) {
  // 递归创建响应式数据
  observer(value);
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newVal) {
      if (value !== newVal) {
        observer(newVal)
        value = newVal;
        console.log('update');

      }

    }
  })
}

let data = { name: 'name', data: { a: 1 }, arr: [{ a: 1 }, 3] }
observer(data)
// data.name = '121'
data.arr.push(12)
console.log(data);
