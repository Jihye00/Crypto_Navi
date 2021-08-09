const test = require('./Data/test_v3.js');
const type = require('./Algorithm/type_v3.js');
const safemath = require("safemath");
const swap = require('./Data/swap.js');
const Caver = require('caver-js');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
const shifts = require('./Data/shifts.js')

var data;
var resratio;
async function prepareMatrix(tokenA, tokenB, howmany){
    await test.test();
    var route_matrix = new type.Route_Matrix(type.CurrencyLists);
    // console.log(type.SwapMatrix);
    route_matrix.calc(20, tokenA, howmany);
    var indexA = type.index_finder(tokenA);
    var indexB = type.index_finder(tokenB);
    console.log(route_matrix.matrix[indexA][indexB]);
    data = route_matrix.matrix[indexA][indexB].path;
    resratio = route_matrix.matrix[indexA][indexB].ratio;
    // data['slippage'] = 100 * (1 - data['slippage'])
}

async function getSwappedAmount(txhash, tokenname) {
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

async function ShowRouting (tokenA = 'DUMMY', tokenB = 'DUMMY', howmany = -1) {
    if (tokenA == 'DUMMY' || tokenA == 'DUMMY' || howmany == -1){
        return 'not available'
    }
    else {
        await prepareMatrix(tokenA, tokenB, howmany);
        return data;
    }
}

async function SwapRouting (tokenA = 'DUMMY', tokenB = 'DUMMY', howmany = -1) {
    if (tokenA == 'DUMMY' || tokenA == 'DUMMY' || howmany == -1){
        return 'not available'
    }
    var amount = howmany;
    console.log(data)
    for (var j = 0; j < data.length; j++) {
        params = data[j].split(',');
        console.log('\n');
        console.log( "   swap " + (j + 1) + " ================================================= \n")
        console.log(params)
        console.log(params[0] + " to swap : " + amount)
        if (params[3] != 0 && params[5] != 0) {
            console.log("1")
            amount_Ksp = safemath.safeMule(safemath.safeDiv(params[3], safemath.safeAdd(params[3], params[5])), amount)
            amount_Def = safemath.safeMule(safemath.safeDiv(params[5], safemath.safeAdd(params[3], params[5])), amount)

            amount_Ksp = await getSwappedAmount(await swap.swap(params[0], params[1], amount_Ksp, params[2]), params[1]);
            amount_Def = await getSwappedAmount(await swap.swap(params[0], params[1], amount_Def, params[4]), params[1]);

            amount = safemath.safeAdd(amount_Ksp, amount_Def);
        }
        else if (params[3] != 0){
            console.log("2")
            amount = await getSwappedAmount(await swap.swap(params[0], params[1], amount, params[2]), params[1]);
        }
        else if (params[5] != 0){
            console.log("3")
            amount = await getSwappedAmount(await swap.swap(params[0], params[1], amount, params[4]), params[1]);
        }
        else console.log("warning\n\n\nwarning\nwarning\n\n\n\nwarning\n\nwarning\n\n");
        
    }
    console.log("\n==Crypto_NAVI_V3 Result ==")
    console.log('from : ' + howmany +' '+ tokenA + ' swapped ' + Number(amount) + ' ' + tokenB)
    console.log('expected : ' + resratio)
}

async function SmartSwapRouting (tokenA, tokenB, howmany) {
    // const start = Date.now();
    await prepareMatrix(tokenA, tokenB, howmany);
    var amount = howmany;
    console.log(data)
    for (var j = 0; j < data.length; j++) {
        params = data[j].split(',');
        console.log('\n');
        console.log( "   swap " + (j + 1) + " ================================================= \n")
        console.log(params)
        console.log(params[0] + " to swap : " + amount)
        if (params[3] != 0 && params[5] != 0) {
            console.log("1")
            amount_Ksp = safemath.safeMule(safemath.safeDiv(params[3], safemath.safeAdd(params[3], params[5])), amount)
            amount_Def = safemath.safeMule(safemath.safeDiv(params[5], safemath.safeAdd(params[3], params[5])), amount)

            amount_Ksp = await getSwappedAmount(await swap.swap(params[0], params[1], amount_Ksp, params[2]), params[1]);
            amount_Def = await getSwappedAmount(await swap.swap(params[0], params[1], amount_Def, params[4]), params[1]);

            amount = safemath.safeAdd(amount_Ksp, amount_Def);
        }
        else if (params[3] != 0){
            console.log("2")
            amount = await getSwappedAmount(await swap.swap(params[0], params[1], amount, params[2]), params[1]);
        }
        else if (params[5] != 0){
            console.log("3")
            amount = await getSwappedAmount(await swap.swap(params[0], params[1], amount, params[4]), params[1]);
        }
        else console.log("warning\n\n\nwarning\nwarning\n\n\n\nwarning\n\nwarning\n\n");
        
    }
    console.log("\n==Crypto_NAVI_V3 Result ==")
    console.log('from : ' + howmany +' '+ tokenA + ' swapped ' + Number(amount) + ' ' + tokenB)
    console.log('expected : ' + resratio)
    // console.log(data)
    // console.log((Date.now() - start)/1000 + 'sec');
}

async function execute (tokenA, tokenB, amount) {
    await ShowRouting(tokenA, tokenB, amount);
    await SwapRouting(tokenA, tokenB, amount);
}

execute('KUSDT', 'KLAY', "3.652481");
// SmartSwapRouting('KUSDT', 'KLAY', "3.731073");
// 0.
