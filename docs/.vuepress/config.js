module.exports = {
  title: '前端学习笔记',
  description: '用于记录前端学习记录',
  dest: './dist',
  themeConfig: {
    nav: [
      // {
      //   text: 'js基础',
      //   link: '/js/es6'
      // },
      // {
      //   text: 'react',
      //   items: [
      //     { text: '基础', link: '/react/basic' }
      //   ]
      // },
      {
        text: 'webpack',
        items: [
          // { text: '基础', link: '/webpack/basic' },
          // { text: 'plugin', link: '/webpack/plugin' },
          {
            text: 'html-webpack-plugin分析实现',
            link: '/webpack/html-webpack-plugin.html',
          },
          // { text: 'loader', link: '/webpack/loader4' },
        ],
      },
      {
        text: 'react',
        items: [
          {
            text: 'redux',
            link: '/react/redux/',
          },
        ],
      },
      {
        text: '每日一题',
        link: '/question/',
      },
      {
        text: '杂记',
        link: '/other/',
      },
    ],
    sidebar: {
      '/js/': ['es6'],
      // '/webpack': [
      //   'plugin'
      // ]
    },
  },
};
