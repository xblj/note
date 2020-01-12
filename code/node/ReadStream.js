const Event = require('events');
const fs = require('fs');
module.exports = class ReadStream extends Event {
  constructor(path, options) {
    super();
    // 初始化配置
    this.path = path;
    this.flags = options.flags || 'r';
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.start = options.start || 0;
    this.end = options.end;
    this.autoClose = options.autoClose || true;
    this.flowing = null;
    this.pos = this.start;
    // 打开文件
    this.open();
    // 监听是否监听了data事件，如果监听了，就自动进入流动模式
    this.on('newListener', (type) => {
      if (type === 'data') {
        this.flowing = true;
        this.read()
      }
    })
  }

  read() {
    if (typeof this.fd !== 'number') {
      this.once('open', () => this.read());
      return;
    }
    // 初始化一个buffer容器
    let buffer = Buffer.alloc(this.highWaterMark);
    let howMuchToRead = this.end ? Math.min(this.end - this.pos + 1, buffer.length) : buffer.length;
    fs.read(this.fd, buffer, 0, howMuchToRead, this.pos, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
        return;
      }
      if (bytesRead) {
        this.pos += bytesRead;
        this.emit('data', buffer.slice(0, bytesRead));
        if (this.flowing) {
          this.read();
        }
      } else {
        this.emit('end');
        this.destroy();
      }
    })
  }

  destroy(err) {
    if (this.autoClose) {
      if (typeof this.fd === 'number') {
        fs.close(this.fd, () => {
          this.emit('close')
        });
      }
      if (err) {
        this.emit('error', err)
      }
    }
  }

  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.emit('error', err);
        return;
      }

      this.fd = fd;
      this.emit('open', fd);
    })
  }

  resume() {
    this.flowing = true;
    this.read();
  }
  pause() {
    this.flowing = false;
  }
}