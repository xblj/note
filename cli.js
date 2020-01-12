const chokidar = require('chokidar');
const spawn = require('cross-spawn');

const watcher = chokidar.watch('./docs/**/*', {
  persistent: true
});

let child = null;
let reStart = false;


watcher
  .on('add', path => console.log(`File ${path} has been added`))
  .on('change', path => {
    if (path === 'docs\\.vuepress\\config.js') {
      const res = child.kill()
      console.log(res);

      reStart = true
    }
  })
  .on('unlink', path => console.log(`File ${path} has been removed`));

start();
child.on('close', () => {
  // process.exit();

  // if (reStart) {
  //   child = start();
  // }
})
function start() {
  child = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
  });
  // process.exit(1)
}


setTimeout(() => {
  const res = child.kill(2)
  console.log('res', res);
}, 10000);