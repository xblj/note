function mockNew(fn, ...args) {
  const temp = {};
  const res = fn.apply(temp, args);
  if (typeof res === 'object') {
    return res;
  }
  Reflect.setPrototypeOf(temp, fn.prototype)
  return temp;
}

function Animal(name) {
  this.name = name
  return { a: 1 }
}

Animal.prototype.sayName = function () {
  console.log(this.name);
}

const animal = new Animal('animal');
const animal1 = mockNew(Animal, 'animal')
console.log(animal);

console.log(animal1);

