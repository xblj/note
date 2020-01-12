const { createApp, dev, build, eject } = require('vuepress');


(async () => {
  let res = await dev()
  console.log(res.server);
})()
// async function dev(options) {
//   const app = createApp(options)
//   await app.process()
//   return app.dev()
// }

// const res = dev()
// console.log(res);
