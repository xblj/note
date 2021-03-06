# ES6

## var/let/const

- var
  - 变量提升
  - 直接挂载在 global 上，浏览器就是 window 上
- let
  - 不会有变量提升
  - 创建自己的作用域，不会挂载在 window 上
  - 暂时性死区
  - 不能重复声明
- const

  - 申明常量基本类型（string/number/boolean/null/undefined）的值不能改，引用类型（object/array）引用地址不能更改

  ```js
  const arr = [1, 2];
  // 修改现有值以及添加添加新的值是可以的
  arr[0] = 2; // ok
  arr.push(3); //ok
  // 赋值一个新的数组不行
  arr = [1, 2, 3]; // error

  var obj = {
    a: 1,
    b: 2,
  };
  // 修改现有属性以及添加新的属性是可以的
  obj.a = 2; //ok
  obj.c = 3; // ok
  // 直接赋值一个新的对象不行
  obj = { c: 3 }; //error
  ```

  - 如果需要保证对象的属性也不能更改可以使用`Object.freeze`

  ```js
  const freeze = obj => {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        freeze(obj);
      }
    });
  };
  ```

## 解构

- 对象

```js
const a = {
  x: 1,
  y: 2,
  z: 3,
};

const { x,y:y2 rest } = a;
// x=>1,
// 可以为变量y重新命名为y2
// reset=>{z:3}
```

- 为已经提前声明的变量解构

```js
let x;
{x} ={x:1};//错误，不能这么写
({x}={x:1});//ok
```

- 字符串

  ```js
  const [a, b] = 'hello';
  //a=>h;b=>e;
  ```

- set

```js
let [x, y] = new Set([1, 2]);
// x=>1;y=>2
```

- 设置默认值

```js
// 当没有对应的值时，会使用默认值
let { a, b = 2, c = 3 } = { a: 1, c: null };
// a=>1;b=>2;c=>null
// 对null使用默认值不会成功
let [x, y = 2] = [1];
// y=>2
```

## 展开运算符

```js
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { ...obj1, ...obj2 }; // {a:1,b:2}

const arr1 = [1, 2];
const arr2 = [2, 3];
const arr3 = [...arr1, ...arr2]; // [1,2,2,3]
// 交换两个变量的值
let a = 1;
let b = 2;
[a, b] = [b, a];
```

## set

集合中不能有重复的项

- 数组

```js
const arr = [1, 2, 3];
const [a, ...rest] = arr;
// a=>1, rest=>[2,3]
```

## class

- 概念
  - 类：通过关键字`class` 声明的就是一个类，如下`Animal`
  - 实例：实例是通过`new`关键字调用类实例化而来，如下`a1`

```js
class Animal {
  // 类构造函数，如果不需要初始化实例属性，可以不写
  constructor(name) {
    this.name = name;
    // 和下面直接在类中的leg=4等价
    // this.leg = 4;
  }

  // 实例属性，需要通过实例访问
  // 语法糖而已，等价于在constructor中的this.leg=4
  leg = 4;

  // 静态属性
  // 使用：Animal.b
  static b = 1;

  // 静态方法
  // 使用：Animal.a()
  static a() {
    console.log('静态方法');
  }

  // 实例方法
  say() {
    console.log(this.name);
  }
}
console.log(Animal.b);
console.log(Animal.a);
// 实例化
const a1 = new Animal('动物');
a1.say(); // 动物
console.log(a1.leg);
```

- 继承

  子类能继承父类的属性与方法

```js
class Bird extends Animal {
  constructor(name, color) {
    // 此处能访问super，super就是Animal的constructor
    super(name);
    // 在访问this之前必须先调用super，否则会报错
    // 能重写父级的属性
    this.leg = 2;
    // 能添加自己的属性
    this.color = color;
  }

  static get a() {
    // Object.defineProperty简写
    // 这里的super ？
  }

  // 可以重写父级的实例方法
  say() {
    // super是父类的原型:Animal.prototype
    super.say();
  }

  // 可以添加自己的方法
  fly() {
    console.log('i can fly');
  }

  static a() {
    // super指向的是父类:Animal
    return super.a();
  }
}
let tiger = new Bird('乌鸦');
```
