const test = require('./Data/test2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_cycle.js');

async function main(tokenA, tokenB,){
    var array = await test.test();
    var klayswap = array[0], definix = array[1];
    // console.log(klayswap);
    var matrix = await graph.graph(klayswap, definix);
    let indexA = type.CurrencyLists.indexOf(tokenA);
    let indexB = type.CurrencyLists.indexOf(tokenB);
    // console.log(JSON.stringify(matrix))
    console.log('routing from' + tokenA +' to ' + tokenB);
    console.log(matrix[indexA][indexB].path + matrix[indexA][indexB].ratio.toString().padStart(20));
}
// const CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp

main('KBNB','KUSDT');

