const test = require('./Data/test_v3.js');
const type = require('./Algorithm/type_v3.js');
const swap = require('./Data/swap.js');
const Caver = require('caver-js');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
const shifts = require('./Data/shifts.js')

var data;
async function main(tokenA, tokenB){
    await test.test();
    var route_matrix = new type.Route_Matrix(type.CurrencyLists);
    // console.log(type.SwapMatrix);
    route_matrix.calc(20, tokenA, 1);
    var indexA = type.index_finder(tokenA);
    var indexB = type.index_finder(tokenB);
    data = route_matrix.matrix[indexA][indexB];
}
async function e () {
    // const start = Date.now();
    await main('KLAY', 'KUSDT');
    console.log(data)
    // console.log((Date.now() - start)/1000 + 'sec');
}
e()


// async function unitConversion(txhash, tokenname) {
//     let tx = await caver.klay.getTransactionReceipt(txhash);
//     for (let n in tx.logs) {
//       if ((tx.logs[n].address).toUpperCase() == (test.TOKEN_ADDRESS[tokenname]).toUpperCase()) {

//         let res ='';
//         res += caver.abi.decodeParameter('uint256', tx.logs[n].data);
//         console.log("if curious tx address : " + txhash);
//         console.log(tokenname + " swapped : " + shifts.lshift(res, swap.TOKEN_DECIMAL[tokenname]));

//         return await shifts.lshift(res, swap.TOKEN_DECIMAL[tokenname]);
//       }
//     }
//     console.log("swapped currency data not found")
//   };

// async function SmartSwapRouting (tokenA, tokenB, howmany) {
//     await prepareMatrix(tokenA, tokenB);
//     var amount = howmany;
//     for (j = 0; j < data.length; j++) {
        
//         params = data[j].split(' ');
//         console.log('\n');
//         console.log( "   swap " + (j + 1) + " ================================================= \n")
//         console.log(params)
//         console.log(params[0] + " to swap : " + amount)
//         amount = await unitConversion(await swap.swap(params[0], params[2], amount, params[4]), params[2])
//     }
//     console.log("\n==Crypto_NAVI_V2 Result ==")
//     console.log('from : ' + howmany +' '+ tokenA + ' swapped ' + Number(amount) + ' ' + tokenB)
//     console.log(data)
// }

// SmartSwapRouting('KLAY', 'KUSDT', "1");