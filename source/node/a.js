const ReadStream = require('./1');
const fs = require('fs');

// const rs = new ReadStream('./a.txt', {
//   highWaterMark: 3
// })

const rs = fs.createReadStream('./a.txt', {
  highWaterMark: 3
})

const arr = [];

rs.on('data', (data) => {
  // rs.pause();
  console.log(data);

  arr.push(data);
})

setTimeout(() => {
  // rs.resume()
}, 1000);

rs.on('open', (fd) => {
  console.log('open', fd);
})

rs.on('error', (error) => {
  console.log(error);
})

rs.on('end', () => {
  console.log(Buffer.concat(arr).toString());
})
