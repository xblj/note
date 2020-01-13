const EventEmitter = require('events');

let fs = require('fs');

class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}

class LinkList {
  constructor() {
    this.head = null;
    this.length = 0
  }
  append(content) {
    const node = new Node(content);
    if (this.head === null) {
      // 首次添加
      this.head = node;
    } else {
      let cur = this.head;
      while (cur.next) {
        cur = cur.next;
      }
      cur.next = node;
    }
    this.length++;
  }
  get() {
    let head = this.head;
    if (!head) return;
    this.head = head.next;
    this.length--;
    return head.element;
  }
}

const lk = new LinkList();

lk.append('1')
lk.append('2')
lk.append('3')

console.log(lk.length);
const content = lk.get()
console.log(content);
console.log(lk.length);


module.exports = class extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.autoClose = options.autoClose || true;
    this.mode = options.mode || 0o666;
    this.encoding = options.encoding || 'utf8';

    this._writing = false;
    this.cache = new LinkList();
    this.needDrain = false;
    this.pos = options.start;

    this.len = 0;
    this.fd = null;
    this.open();
  }
  write(chunk, encoding = this.encoding.cb) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let flag = this.len < this.highWaterMark;
    this.needDrain = !flag;
    if (this._writing) {
      // 正在写入中,就加入到内存中
      this.cache.append({
        chunk,
        encoding,
        cb
      });
    } else {
      this._writing = true;
      this._write(chunk, encoding, () => {
        cb && cb();
        this.clearBuffer()
      })
    }
    return flag;
  }

  clearBuffer() {
    const obj = this.cache.get();
    if (obj) {
      this._write(obj.chunk, obj.encoding, () => {
        obj.cb && obj.cb();
        this.clearBuffer();
      });
    } else {
      this._writing = false;
      if (this.needDrain) {
        this.needDrain = false;
        this.emit('drain')
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
  _write(chunk, encoding, clearBuffer) {
    if (typeof this.fd === 'number') {
      this.once('open', () => this._write(chunk, encoding, cb))
      return;
    }
    fs.write(this.fd, chunk, 0, chunk.length, (err, written) => {
      if (err) {
        this.emit('error', err);
        return
      }
      this.pos += written;
      this.len -= this.pos;
      clearBuffer()
    })
  }
}