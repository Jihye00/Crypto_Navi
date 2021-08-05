const test = require('./Data/test_v2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_v2.js');
const swap = require('./Data/swap.js');
const Caver = require('caver-js');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
const shifts = require('./Data/shifts.js')

var data;
var swapratio;
async function prepareMatrix(tokenA, tokenB){
    var array = await test.test();
    var klayswap = array[0], definix = array[1];
    // console.log(klayswap);
    var matrix = await graph.graph(klayswap, definix);

    var indexA = type.CurrencyLists.indexOf(tokenA);
    var indexB = type.CurrencyLists.indexOf(tokenB);
    console.log(matrix[indexA][indexB]);
    data = matrix[indexA][indexB].path;
    swapratio = matrix[indexA][indexB].ratio;
}

async function unitConversion(txhash, tokenname) {
    let tx = await caver.klay.getTransactionReceipt(txhash);
    for (let n in tx.logs) {
      if ((tx.logs[n].address).toUpperCase() == (test.TOKEN_ADDRESS[tokenname]).toUpperCase()) {

        let res ='';
        res += caver.abi.decodeParameter('uint256', tx.logs[n].data);
        console.log("if curious tx address : " + txhash);
        console.log(tokenname + " swapped : " + shifts.lshift(res, swap.TOKEN_DECIMAL[tokenname]));

        return await shifts.lshift(res, swap.TOKEN_DECIMAL[tokenname]);
      }
    }
    console.log("swapped currency data not found")
  };

async function SmartSwapRouting (tokenA, tokenB, howmany) {
    await prepareMatrix(tokenA, tokenB);
    var amount = howmany;
    for (j = 0; j < data.length; j++) {
        
        params = data[j].split(' ');
        console.log('\n');
        console.log( "   swap " + (j + 1) + " ================================================= \n")
        console.log(params)
        console.log(params[0] + " to swap : " + amount)
        amount = await unitConversion(await swap.swap(params[0], params[2], amount, params[4]), params[2])
    }
    console.log("\n==Crypto_NAVI_V2 Result ==")
    console.log('from : ' + howmany +' '+ tokenA + ' swapped ' + Number(amount) + ' ' + tokenB)
    console.log(data)
}

SmartSwapRouting('KLAY', 'KUSDT', "1");
// 0.
