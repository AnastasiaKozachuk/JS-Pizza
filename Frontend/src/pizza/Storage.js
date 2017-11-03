var basil = require('basil.js');
basil = new basil();
exports.write = function(key,value){
   return  basil.set(key,value);
};

exports.read = function(key){
   return basil.get(key);
};