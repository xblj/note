const fs = require('fs');

const ws = fs.createWriteStream('./a.txt', {
  flags: 'w',
  highWaterMark: 3,
  autoClose: true,
  start: 0,
  mode: 0o666,
  encoding: 'utf8'
})

ws.write('1234', 'utf8', () => {
  console.log('over');

})