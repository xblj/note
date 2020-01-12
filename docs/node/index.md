# node

## 能干什么

- 可以写工具库
- 做中间层
- 擅长 I/O 密集 不擅长计算（cpu 密集）
- 高并发

## 全局变量 global

在文件中不用申明就可以直接使用的变量

- 声明的变量不会挂载在 global

```js
var a = 0;

global.a; //undefined
```

- process 当前运行的进程对象

  - platform 平台
  - argv 传递的参数

  ```js
  // 处理参数

  process.argv;
  ```

  - pid 进程 id
  - cwd 用户执行 node 所在的目录
  - nextTick 下一次队列，微任务
  - env 环境变量
    - mac export mode=dev
    - windows set mode=dev

- Buffer 缓存区
- setInterval/clearInterval/clearTimeout/setTimeout/setImmediate/clearImmediate
- v8 引擎上的方法都是存在的，默认不可枚举

```js
console.log(global, { showHidden: true });
```
