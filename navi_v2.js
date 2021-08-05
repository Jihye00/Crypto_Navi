const test = require('./Data/test_v2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_v2.js');
const swap = require('./Data/swap.js');
const Caver = require('caver-js');
// const { pow } = require('mathjs');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
const shifts = require('./Data/shifts.js')

var data;
async function main(tokenA, tokenB){
    var array = await test.test();
    var klayswap = array[0], definix = array[1];
    // console.log(klayswap);
    var matrix = await graph.graph(klayswap, definix);

    var indexA = type.CurrencyLists.indexOf(tokenA);
    var indexB = type.CurrencyLists.indexOf(tokenB);
    console.log(matrix[indexA][indexB]);
    // console.log(tokenA);
    // console.log(tokenB);

    data = matrix[indexA][indexB].path;
}

async function value(txhash, tokenname) {
    // console.log("entered value 1")
    let tx = await caver.klay.getTransactionReceipt(txhash);
    //console.log(tx);
    for (let n in tx.logs) {
      //console.log(tx.logs[n].address);
      //console.log(TOKEN_ADDRESS.KWBTC);
      if ((tx.logs[n].address).toUpperCase() == (test.TOKEN_ADDRESS[tokenname]).toUpperCase()) {
        // console.log(tx.logs[n].data);
        let res ='';
        res += caver.abi.decodeParameter('uint256', tx.logs[n].data);
        // console.log(res)
        console.log("if curious tx address : " + txhash);

        // console.log(tokenname + " swapped : " + res / (10 ** swap.TOKEN_DECIMAL[tokenname]));
        console.log(tokenname + " swapped : " + shifts.lshift(res, swap.TOKEN_DECIMAL[tokenname]));
        // console.log('----------------------------------')
        // console.log("swapped amount in hex : "+tx.logs[n].data)
        // console.log(res);
        // return res / pow(10, swap.TOKEN_DECIMAL[tokenname]);
        return await shifts.lshift(res, swap.TOKEN_DECIMAL[tokenname]);
        // return res;
      }
    }
    console.log("???????????????")
  };

let test_list = ['KLAY', 'KUSDT', 'KWBTC', 'KXRP']

async function SmartSwapRouting (tokenA, tokenB, howmany) {
    await main(tokenA, tokenB);
    // console.log(howmany)
    var amount = howmany;
    for (j = 0; j < data.length; j++) {
        
        params = data[j].split(' ');
        console.log('\n');
        console.log( "   swap " + (j + 1) + " ================================================= \n")
        console.log(params)

        console.log(params[0] + " to swap : " + amount)
        amount = await value(await swap.swap(params[0], params[2], amount, params[4]), params[2])
        
        // console.log("iteration : " + j)
    }
    console.log("\n==Crypto_NAVI Result ==")
    console.log('from : ' + howmany +' '+ tokenA + ' swapped ' + Number(amount) + ' ' + tokenB)
    console.log(data)
    // value(await swap.swap('KLAY', 'KUSDT', 1.234, 'KLAYSWAP'), params[2])
}
const CurrencyListsasdf = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC', 'FINIX']; // xrp, btc, six, ksp

SmartSwapRouting('KUSDT', 'KLAY', "0.880774");
// SmartRouting('SIX', 'KUSDT', 66.659892011026422793)
// 0.000000000000000238
