const math = require('mathjs');
const caver = require('caver-js');


var int = "0.000000000001001";

var multip = Math.pow(10, 18);

var res = int * multip;

var bigmultip = math.BigNumber(Math.pow(10, 18))
var bigres = bigint * bigmultip;
console.log(res)
console.log(bigres)

console.log(caver.utils.toPeb(int))

