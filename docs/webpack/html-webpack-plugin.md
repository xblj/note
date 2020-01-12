# 实现 html-webpack-plugin

本实现借鉴[https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)的实现思路，并未完全按照前者实现，也不试用与生产环境，仅仅只为了学习 webpack 插件。

## 预备知识

- [compiler 对象](https://webpack.js.org/api/compiler-hooks/)

> 使用`cli`和`node api`所传递的配置创建`compilation`的主要引擎，整个编译过程只会被实例一次。

- [compilation 对象](https://webpack.js.org/api/compilation-hooks/)

> 代表一次构建，开发环境时，每次文件改变就会创建一个新的 `compilation` 对象，产生新的输出文件。

- [stats 对象](https://webpack.js.org/api/stats/)

> 当 webpack 在编译源代码时，我们可以生成一个描述模块的`JSON`文件，可以用来分析依赖情况。

1. 命令行生成：

```bash
webpack --profile --json > compilation-stats.json
```

2. 可以在 compilation 获取

```js
const json = compilation.getStats().toJson();
```

下面列出三个比较常用的属性，也是我们本次需要用到的属性

| 字段    | 含义                                                       |
| ------- | ---------------------------------------------------------- |
| modules | 记录了所有解析后的模块，简单的理解就是一个文件就是一个模块 |
| chunks  | 记录了所有 chunk，多个模块可以合成为一个 chunk             |
| assets  | 记录了所有要生成的文件                                     |

- 子编译

> `childCompiler`和`compiler`都是`Compiler`的实例，在`childCompiler`实例化后，会复制`compiler`上的钩子到`childCompiler`上，除了如下的："make", "compile", "emit", "afterEmit", "invalid", "done", "thisCompilation"

```js
// 创建一个子compiler
const childCompiler = compilation.createChildCompiler(
  // childCompiler的名称，便于debug
  compilerName,
  outputOptions,
  // 应用到childCompiler上的插件
  plugins
);
childCompiler.runAsChild((err, entries, childCompilation) => {});
```

## 插件书写规范

插件结构很简单，就两条规则：

1. 定义一个类
2. 类有一个`apply`方法

```js
export default class HelloWebpackPlugin {
  apply(compiler) {
    // todo
  }
}
```

## 实现思路

1. 我们要在构建之后新产生一个`index.html`文件，那么我们必须在 `webpack` 输出文件到输出目录之前时候告诉 `webpack` 我们需要将`index.html`添加到输出目录中。

2. 那如何告诉 `webpack` 呢？

   - `webpack` 的输出文件都会挂载`compilation.assets`上，如果需要添加或者删除文件，可以直接对该属性进行操作

3. 知道了如何在输出目录中添加文件，那什么时候添加呢？

   - `webpack` 在将所有文件编译完成之后会触发`compiler`对象上的`emit`钩子，这是增删改文件的最后时机，所以我们可以在这个钩子内进行添加

4. html 内容怎么来呢？

   - 1. 根据准备一个[默认模板](#默认模板)或者自定义一个模板，由于 `webpack` 只认识 js 文件，我们要让 `webpack` 能处理我们的准备的 html 模板，那么需要一个额外的[loader](#loader) 来处理这个 html 文件

   - 2. 我们是在父编译流程外去添加一个 html 文件，所以我们可以应用[子编译](#子编译)来编译 html，然后将编译完成的内容添加到父级`compilation.assets`上

5. 需要添加到 html 文件中的资源从哪来？

   1. 资源一般分为两种 css 样式文件和 js 脚本文件，分别对应标签：

      - css: `<link rel="stylesheet" href="xxx.css">`
      - js: `<script src="xxxx.js" type="text/javascript"></script>`

   2. 所有输出的代码块都在`stats`对象的`chunks`属性(可以通过`compilation.getStats().toJson().chunks`拿到)上，筛选出首屏加载的`js`和`css`文件

6. 然后就比较简单了，就是各种组装`js`和`css`标签, 具体见如下实现[主模块](#主模块)

## 实现

### 目录结构

```
|-- root
    |-- template.html
    |-- index.js
    |-- lib
        |-- compiler.js
        |-- loader.js

```

### 默认模板

> ./template.html

<<< @/code/webpack/html-webpack-plugin/template.html

### 主模块

> ./index.js

<<< @/code/webpack/html-webpack-plugin/index.js

### 子编译

> ./lib/compiler.js

<<< @/code/webpack/html-webpack-plugin/lib/compiler.js

### loader

> ./lib/loader

<<< @/code/webpack/html-webpack-plugin/lib/loader.js
