const path = require('path');
const cheerio = require('cheerio');
const { AsyncSeriesWaterfallHook } = require('tapable');
const childCompiler = require('./lib/compiler');

/**
 * @typedef {import('webpack/lib/Compilation')} Compilation
 */

/**
 * @typedef {import('webpack/lib/Chunk')} Chunk
 */

/**
 * @typedef {Object} Assets
 * @property {Array<string>} js
 * @property {Array<string>} css
 */

/**
 * @typedef {Object} AssetTag
 * @property {string} tagName
 * @property {boolean} selfClose
 * @property {Object} attributes
 */

/**
 * @typedef {Object} AssetTagObj
 * @property {AssetTag} head
 * @property {AssetTag} body
 */

const PLUGIN_ID = 'HtmlWebpackPlugin';

class HtmlWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      template: path.join(__dirname, './template.html'),
      filename: 'index.html',
      ...options,
    };
  }

  apply(compiler) {
    let compilationPromise;
    // 将摸板相对地址改写为添加了loader处理的绝对路径, a.html => a-loader!b-loader!c:\\xxx\a.html
    this.options.template = this.getFullTemplatePath(
      this.options.template,
      compiler.context
    );
    compiler.hooks.compilation.tap(PLUGIN_ID, compilation => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags = new AsyncSeriesWaterfallHook(
        ['assetTags']
      );
    });

    compiler.hooks.make.tapAsync(PLUGIN_ID, (compilation, callback) => {
      compilationPromise = childCompiler
        .compileTemplate(
          this.options.template,
          compiler.context,
          this.options.filename,
          compilation
        )
        .then(compilationResult => {
          this.childCompilerHash = compilationResult.hash;
          this.childCompilationOutputName = compilationResult.outputName;
          callback();
          // 编译之后的代码
          return compilationResult.content;
        });
    });

    compiler.hooks.emit.tapAsync(PLUGIN_ID, (compilation, callback) => {
      // const applyPluginsAsyncWaterfall = this.applyPluginsAsyncWaterfall(
      //   compilation
      // );

      let { chunks } = compilation.getStats().toJson();
      // 过滤不需要写入html文件中的chunk
      chunks = this.filterChunks(chunks);

      // 根据过滤后的chunks组装对应的css和js资源:30
      const assets = this.htmlWebpackPluginAssets(chunks);

      (async () => {
        // 等待子编译完成
        let compiledTemplate = await compilationPromise;
        // 直接返回html文件，省略
        let compilationResult = this.evaluateCompilationResult(
          compilation,
          compiledTemplate
        );

        // 执行模板函数，替换模板中的变量
        let html = this.executeTemplate(
          compilationResult,
          chunks,
          assets,
          compilation
        );

        // 根据资源生成要插入到html文件中的标签
        let assetTags = this.generateHtmlTags(assets);

        assetTags = await compilation.hooks.htmlWebpackPluginAlterAssetTags.promise(
          assetTags
        );

        // 将标签插入到html中
        html = this.injectAssetTagsIntoHtml(html, assetTags);

        // 将需要输出到文件系统的添加到assets上
        compilation.assets[this.childCompilationOutputName] = {
          source: () => html,
          size: () => html.length,
        };

        callback();
      })();
    });
  }

  /**
   * 获取配置文件中的模板参数
   * @param {Compilation} compilation
   * @param {assets} assets
   */
  getTemplateParameters(compilation, assets) {
    const { templateParameters } = this.options;
    if (typeof templateParameters === 'function') {
      return templateParameters(compilation, assets, this.options);
    }
    if (typeof templateParameters === 'object') {
      return templateParameters;
    }
    return {};
  }

  /**
   * 执行模板函数，将配置里面的变量插入到html中
   * @param {Function} templateFunction
   * @param {Array} chunks
   * @param {Assets} assets
   * @param {Compilation} compilation
   * @returns {string} html文件内容
   */
  executeTemplate(templateFunction, chunks, assets, compilation) {
    const templateParams = this.getTemplateParameters(compilation, assets);
    const html = templateFunction(templateParams);
    return html;
  }

  /**
   * 执行
   * @param {Compilation} compilation
   * @param {string} source 经过loader处理后的代码
   * @returns {Function} 用于生成html文件内容的函数
   */
  evaluateCompilationResult(compilation, source) {
    source = source.replace('var HTML_WEBPACK_PLUGIN_RESULT =', '');
    // 源码中是在vm沙盒中运行，不是我们的学习的重点，为了简单就直接通过eval运行
    return eval(source);
  }

  /**
   * 将js/css资源添加到html文件模板中
   * @param {string} temp html文件模板
   * @param {AssetTagObj} assetTags
   */
  injectAssetTagsIntoHtml(temp, assetTags) {
    const { head, body } = assetTags;
    const $ = cheerio.load(temp);
    const generateElement = item => {
      let str = `<${item.tagName}`;
      Object.keys(item.attributes).forEach(attr => {
        str += ` ${attr}=${item.attributes[attr]}`;
      });
      if (item.selfClose) {
        // 自闭合标签
        str += ' />';
      } else {
        str += `></${item.tagName}>`;
      }
      return $(str);
    };

    $('head').append(head.map(generateElement));
    $('body').append(body.map(generateElement));

    return $.html();
  }

  /**
   * 根据资源生成插入到html文件中的标签对象
   * @param {Assets} assets
   * @returns {AssetTagObj}
   */
  generateHtmlTags(assets) {
    const { js, css } = assets;
    const head = css.map(stylePath => {
      return {
        tagName: 'link',
        selfClose: true,
        attributes: {
          href: stylePath,
          rel: 'stylesheet',
        },
      };
    });

    const body = js.map(scriptPath => {
      return {
        tagName: 'script',
        selfClose: false,
        attributes: {
          src: scriptPath,
          type: 'text/javascript',
        },
      };
    });

    return {
      head,
      body,
    };
  }

  /**
   * 筛选时出js和css文件
   * @param {Array<Chunk>} chunks
   * @returns {Assets}
   */
  htmlWebpackPluginAssets(chunks) {
    const assets = {
      js: [],
      css: [],
    };

    chunks.forEach(chunk => {
      const { files } = chunk;
      const filterFile = reg => file => reg.test(file);
      const js = files.filter(filterFile(/\.js$/));
      const css = files.filter(filterFile(/\.css$/));
      if (js.length) {
        assets.js.push(...js);
      }

      if (css.length) {
        assets.css.push(...css);
      }
    });
    return assets;
  }

  /**
   * 过滤出不需要插入到页面中的chunk
   * @param {Array<Chunk>} chunks
   * @returns {Array<Chunk>}
   * @example
   * 比如动态导入的模块不会插入到页面
   * import('module').then(res => ...)
   */
  filterChunks(chunks) {
    return chunks.filter(chunk => {
      const {
        names: [chunkName],
        initial,
      } = chunk;
      if (!chunkName || !initial) return false;
      return true;
    });
  }

  /**
   * 将模板相对路径改为绝对路径
   * @param {string} template 相对路径
   * @param {string} context 当前上下文
   * @returns {string}
   * @example
   * 输入：
   * 'a-loader!a-loader!path.js?query=2'
   * 返回：
   * 'a-loader!a-loader!c://xxx/xx/path.js?query=2';
   */
  getFullTemplatePath(template, context) {
    if (template.indexOf('!') === -1) {
      // 若果没有设置加载模板的loader，那么就使用默认的loader
      template = `${require.resolve('./lib/loader.js')}!${path.resolve(
        context,
        template
      )}`;
    }
    // 将相对路径修改为绝对路径
    return template.replace(
      /([!])([^/\\][^!?]+|[^/\\!?])($|\?[^!?\n]+$)/,
      (match, prefix, filepath, postfix) =>
        prefix + path.resolve(filepath) + postfix
    );
  }

  /**
   * 异步钩子函数触发帮助函数
   * @param {Compilation} compilation
   */
  applyPluginsAsyncWaterfall(compilation) {
    return (eventName, requiresResult, pluginArgs) => {
      return compilation.hooks[eventName].promise(pluginArgs);
    };
  }
}

module.exports = HtmlWebpackPlugin;
