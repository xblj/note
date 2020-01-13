const path = require('path');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');

/**
 * @typedef {import('webpack/lib/Compilation')} Compilation
 */

/**
 *
 * @param {string} template
 * @param {string} context 当前构建上线文
 * @param {string} outputFilename 输出文件名
 * @param {Compilation} compilation
 */
function compileTemplate(template, context, outputFilename, compilation) {
  const outputOptions = {
    filename: outputFilename,
    publicPath: compilation.outputOptions.publicPath
  };

  /**
   * 每个子编译都需要一个名字，便于区分
   */
  const compilerName = getCompilerName(context, outputFilename);

  // 创建子编译对象
  const childCompiler = compilation.createChildCompiler(
    compilerName,
    outputOptions
  );

  // 如果不重写context会使用父级compiler.context
  childCompiler.context = context;

  // 主要是生成能在node环境中运行的代码，如果我们在webpack.config.js的target设置了node/async-node那么就会默认调用这个插件
  new NodeTemplatePlugin(outputOptions).apply(childCompiler);

  // 主要是引用node的内置模块依赖，比如我们会在代码中用到fs等内置模块，如果不调用这个插件，那么webpack会出现找不到模块
  // 解析模块规则： https://www.webpackjs.com/concepts/module-resolution/
  new NodeTargetPlugin().apply(childCompiler);

  // 将源代码运行的结果赋值到var HTML_WEBPACK_PLUGIN_RESULT 变量上， 在我们实现中没什么用，后面会替换掉
  new LibraryTemplatePlugin('HTML_WEBPACK_PLUGIN_RESULT', 'var').apply(
    childCompiler
  );

  // 编译的入口插件，webpack编译从这个地方开始，以此递归构建每个依赖
  new SingleEntryPlugin(this.context, template, undefined).apply(childCompiler);

  // 主要是做了一件事，就是设置loaderContext.target属性，如果loader可以多环境运行，那么可以通过这个插件设置
  new LoaderTargetPlugin('web').apply(childCompiler);

  return new Promise((resolve, reject) => {
    childCompiler.runAsChild((err, entries, childCompilation) => {
      if (err) {
        reject(err);
      } else {
        // 用于将配置的hash，contenthash等名称替换
        const outputName = compilation.mainTemplate.getAssetPath(
          outputOptions.filename,
          {
            hash: childCompilation.hash,
            chunk: entries[0]
          }
        );
        resolve({
          hash: entries[0].hash,
          outputName,
          content: childCompilation.assets[outputName].source()
        });
      }
    });
  });
}

/**
 * 每个子编译都需要一个名称
 * @param {string} context
 * @param {string} filename
 * @returns {string} 'html-webpack-plugin for "index.html"
 */
function getCompilerName(context, filename) {
  const absolutePath = path.resolve(context, filename);
  const relativePath = path.relative(context, absolutePath);
  return (
    'html-webpack-plugin for "' +
    (absolutePath.length < relativePath.length ? absolutePath : relativePath) +
    '"'
  );
}

module.exports.compileTemplate = compileTemplate;
