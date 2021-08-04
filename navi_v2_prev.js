const test = require('./Data/test_v2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_v2.js');

var data;
async function main(tokenA, tokenB){
    var array = await test.test();
    var klayswap = array[0], definix = array[1];
    // console.log(klayswap);
    var matrix = await graph.graph(klayswap, definix);
    // console.log(request)
    // console.log(JSON.stringify(matrix))
    // var res = [];
    // for (i = 0; i < request.length; i++){
    var indexA = type.CurrencyLists.indexOf(tokenA);
    var indexB = type.CurrencyLists.indexOf(tokenB);
    //     // console.log('routing from ' + request[i][0] +' to ' + request[i][1]);
    // console.log(matrix[indexA][indexB].path + matrix[indexA][indexB].ratio.toString().padStart(20) + '\n');
    data = matrix[indexA][indexB].path;
}
// const CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp
// let requests = [ ['KETH', 'KUSDT'] ,['KLAY','KUSDT'],['KBNB','KUSDT'],['KETH','KUSDT'],['KBNB','KETH'],['KORC','KUSDT']];
async function e () {
    await main('KLAY', 'KUSDT');
    console.log(data)
    // for (i = 0; i < data.length; i++) {
    //     params = data[i].split(' ');
    //     console.log(params)
    //     await swap.swap(params[0], params[2], 5, params[4])
    // }
    // var params = data
}

e()