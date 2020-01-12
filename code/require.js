const path = require('path')

function MyModule() {

}

const setVale = 12;
setInterval(() => {

}, 212);


MyModule.extensions = {};

MyModule.extensions['.js'] = function () { }
MyModule.extensions['.json'] = function () { }

MyModule_resolveFilename = function (id) {
  let absPath = path.resolve(id);


}

function myRequire() {

}
