const _ = require('lodash');
module.exports = function (source) {
  const template = _.template(source, {
    variable: 'data'
  });

  // 以下是源码中的写法，但是我们使用eval来运行代码，会有严格模式，不允许使用with，所以改成下面的方式
  // 下面这样的好处是，我们在模板中不需要通过data.foo获取属性，直接书写foo就行
  // return `
  //  module.exports = function (templateParams) {
  //    with(templateParams) {
  //      return (${template.source})()
  //    }
  //  }
  // `;

  // new LoaderTargetPlugin('web').apply(childCompiler);
  // console.log(this.target);

  return `
    // !! 表示不需要其他loader去处理
    var _ = require('!!lodash');
    module.exports = ${template.source}
  `;
};
