// 用1字节写入10个数
const fs = require('fs');

const ws = fs.createWriteStream('./a.txt', {
  flags: 'w',
  highWaterMark: 1,
  encoding: 'utf8',
  start: 0
})

let index = 0;
function write() {
  let flags = true;
  while (index < 10 && flags) {
    flags = ws.write(`${index++}`)
  }
  if (index === 10) {
    ws.end('over')
  }
}

write()


ws.on('drain', write)