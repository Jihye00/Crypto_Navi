const test = require('./Data/test_v2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_v2.js');
const swap = require('./Data/swap.js');
const Caver = require('caver-js');
const { pow } = require('mathjs');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');

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
async function value(txhash, tokenname) {
    let tx = await caver.klay.getTransactionReceipt(txhash);
    //console.log(tx);
    for (let n in tx.logs) {
      //console.log(tx.logs[n].address);
      //console.log(TOKEN_ADDRESS.KWBTC);
      if ((tx.logs[n].address).toUpperCase() == (test.TOKEN_ADDRESS[tokenname]).toUpperCase()) {
        // console.log(tx.logs[n].data);
        let res = caver.abi.decodeParameter('uint256', tx.logs[n].data);
        // console.log(res);
        return res / pow(10, swap.TOKEN_DECIMAL[tokenname]);
        // return res;
      }
    }
  };


async function SmartRouting () {
    await main('KLAY', 'KUSDT');
    console.log(data)
    var amount = 1;
    for (i = 0; i < data.length; i++) {
        params = data[i].split(' ');
        console.log(params)
        amount = await value(await swap.swap(params[0], params[2], amount, params[4]), params[2])
    }
    // value(await swap.swap('KLAY', 'KUSDT', 1.234, 'KLAYSWAP'), params[2])
}

SmartRouting()

