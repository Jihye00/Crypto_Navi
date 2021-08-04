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

    var indexA = type.CurrencyLists.indexOf(tokenA);
    var indexB = type.CurrencyLists.indexOf(tokenB);
    console.log(matrix[indexA][indexB]);
    // console.log(tokenA);
    // console.log(tokenB);

    data = matrix[indexA][indexB].path;
}
function rshift (stringint, howmany) {
    let origin = stringint.indexOf('.');
    if (stringint.length - origin > howmany){
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0'));
        console.log(origin);
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0').substring(0, origin + howmany))
        return stringint.replace('.', '').padEnd(howmany+origin, '0').substring(0, origin + howmany)
    }
    else {
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0'));
        return stringint.replace('.', '').padEnd(howmany+origin, '0')
    }
}

async function value(txhash, tokenname) {
    let tx = await caver.klay.getTransactionReceipt(txhash);
    //console.log(tx);
    for (let n in tx.logs) {
      //console.log(tx.logs[n].address);
      //console.log(TOKEN_ADDRESS.KWBTC);
      if ((tx.logs[n].address).toUpperCase() == (test.TOKEN_ADDRESS[tokenname]).toUpperCase()) {
        // console.log(tx.logs[n].data);
        let res ='';
        res += caver.abi.decodeParameter('uint256', tx.logs[n].data);
        console.log(res)
        console.log("if curious tx address : " + tx.logs[n].data);

        console.log(tokenname + " swapped : " + res / (10 ** swap.TOKEN_DECIMAL[tokenname]));
        console.log(tokenname + " swapped : " + rshift(res, swap.TOKEN_DECIMAL[tokenname]));
        // console.log('----------------------------------')
        console.log("swapped amount in hex : "+tx.logs[n].data)
        // console.log(res);
        return res / pow(10, swap.TOKEN_DECIMAL[tokenname]);
        // return shift(res, swap.TOKEN_DECIMAL[tokenname]);
        // return res;
      }
    }
  };

let test_list = ['KLAY', 'KUSDT', 'KWBTC', 'KXRP']

async function SmartSwapRouting (tokenA, tokenB, howmany) {
    await main(tokenA, tokenB);
    // console.log(howmany)
    var amount = howmany;
    for (i = 0; i < data.length; i++) {
        
        params = data[i].split(' ');
        console.log('\n');
        console.log( "   swap " + (i + 1) + " ================================================= \n")
        console.log(params)

        console.log(params[0] + " to swap : " + amount)
        amount = await value(await swap.swap(params[0], params[2], amount, params[4]), params[2])
    }
    // value(await swap.swap('KLAY', 'KUSDT', 1.234, 'KLAYSWAP'), params[2])
}
const CurrencyListsasdf = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC', 'FINIX']; // xrp, btc, six, ksp

SmartSwapRouting('KLAY', 'KBNB', "1.000001");
// SmartRouting('SIX', 'KUSDT', 66.659892011026422793)
