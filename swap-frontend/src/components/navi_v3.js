import {klaytn, caver} from "./caver";
import {BigNumber} from 'bignumber.js';

const test = require('./Data/test_v3.js');
const type = require('./Algorithm/type_v3.js');
const safemath = require("safemath");
const swap = require('./Data/swap.js');
const shifts = require('./Data/shifts.js')
const abi = require('./Data/FactoryImpl.json');
const abi_definix = require('./Data/DefinixRouter.json');
const Kip7Abi = require('./Data/Kip7Abi.json');

const empty = [];
var data, data_full;
var resratio;

async function approve(tokenname, dex) {
    const Kip7 = new caver.klay.Contract(Kip7Abi, test.TOKEN_ADDRESS[tokenname]);// 수정
    var approveAddress = "";
    if (dex == 'KLAYSWAP') {
        approveAddress = '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654';
    }
else approveAddress = '0x4E61743278Ed45975e3038BEDcaA537816b66b5B';
    let currentAllowance = await Kip7.methods.allowance(klaytn.selectedAddress, approveAddress).call();
    console.log('currentAllowance', currentAllowance);
    // 0 current allowance means token has not been approved yet
    if (currentAllowance == 0) {
        // approve router to transact the kip-7 token and set allowance to maximum uint256
        let allowance = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        await Kip7.methods.approve(approveAddress, allowance)
            .send({ from: klaytn.selectedAddress, gas: 1000000 },
                function(error, transactionHash) {
                    console.log(transactionHash)
                });
    }
}

async function prepareMatrix(tokenA, tokenB, howmany){
    for(var i8=0; i8<type.MATRIX_SIZE; i8++){
        var row = [];
        for(var j8=0; j8<type.MATRIX_SIZE; j8++){
            var s = new type.Swap(type.CurrencyLists[i8], type.CurrencyLists[j8])
            row.push(s);
        }
        type.SwapMatrix.push(row);
    }
    await test.test();
    var route_matrix = new type.Route_Matrix(type.CurrencyLists);
    // console.log(type.SwapMatrix);
    route_matrix.calc(3, tokenA, howmany);
    var indexA = type.index_finder(tokenA);
    var indexB = type.index_finder(tokenB);
    // console.log(route_matrix.matrix[indexA][indexB]);
    // data['slippage'] = 100 * (1 - data['slippage'])
    data = route_matrix.matrix[indexA][indexB].path;
    data_full = route_matrix.matrix[indexA][indexB];
    resratio = route_matrix.matrix[indexA][indexB].ratio;
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

async function ShowRouting (tokenA = '', tokenB = '', howmany = -1) {
    if (tokenA == '' || tokenB == '' || howmany == -1){
        return 'not available'
    }
    else {
        await prepareMatrix(tokenA, tokenB, howmany);
        return data_full;
    }
}

async function SwapRouting (tokenA, tokenB, amount, dex) {
    var bigamount = BigNumber(await (shifts.lshift(amount, -1 * test.TOKEN_DECIMAL[tokenA])));
    if (dex == "KLAYSWAP") {
        console.log("entered KLAYSWAP")
        const myKlayContract = new caver.klay.Contract(abi.abi, "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654")
        if (tokenA == "KLAY") {
            // let res = await Factory.methods.exchangeKlayPos(TOKEN_ADDRESS[tokenB], 1, empty).send({ from: myWalletAddress, gas: 1000000, value: bigamount });
            let res = await myKlayContract.methods.exchangeKlayPos(test.TOKEN_ADDRESS[tokenB], 1, empty)
                .send({from: klaytn.selectedAddress, gas: 1000000, value: bigamount},
                function(error, transactionHash) {console.log(transactionHash)});
            // console.log(res);
            return res.transactionHash;
        }
    else if (tokenA != "KLAY") {
            await approve(tokenA, dex);
            // let res = await Factory.methods.exchangeKctPos(TOKEN_ADDRESS[tokenA], bigamount, TOKEN_ADDRESS[tokenB], 1, empty).send({ from: myWalletAddress, gas: 1000000 });
            let res = await myKlayContract.methods.exchangeKctPos(test.TOKEN_ADDRESS[tokenA], bigamount, test.TOKEN_ADDRESS[tokenB], 1, empty).send({from: klaytn.selectedAddress, gas: 1000000},
                function(error, transactionHash) {console.log(transactionHash)});
            // console.log(res);
            return res.transactionHash;
        }
    else console.log("KLAYSWAP Corner Case!!!");
    }
    let path = [test.TOKEN_ADDRESS[tokenA], test.TOKEN_ADDRESS[tokenB]];
    if (dex == "DEFINIX") {
        console.log("entered DEFINIX")
        const myDefiContract = new caver.klay.Contract(abi_definix.abi, "0x4E61743278Ed45975e3038BEDcaA537816b66b5B")
        // console.log(“entered DEFINIX”)
        let timestamp = Date.now() + 1000 * 60 * 15;
        if (tokenA == "KLAY") {
            path[0] = "0x5819b6af194a78511c79c85ea68d2377a7e9335f";
            // let res = await Router.methods.swapExactETHForTokens(1, path, myWalletAddress, timestamp).send({ from: myWalletAddress, gas: 1000000, value: bigamount });
            let res = await myDefiContract.methods.swapExactETHForTokens(1, path, klaytn.selectedAddress, timestamp).send({ from: klaytn.selectedAddress, gas: 1000000, value: bigamount });
            // let res = await myDefiContract.methods.swapExactETHForTokens(type.TOKEN_ADDRESS[tokenA],bigamount, type.TOKEN_ADDRESS[tokenB], 1, empty).send({from: klaytn.selectedAddress, gas: 1000000},
            // function(error, transactionHash) {console.log(transactionHash)});
            // console.log(res);
            return res.transactionHash;
        }
    else if (tokenA != "KLAY" && tokenB != "KLAY") {
            await approve(tokenA, dex);
            // let res = await Router.methods.swapExactTokensForTokens(bigamount, 1, path, myWalletAddress, timestamp).send({ from: myWalletAddress, gas: 1000000 });
            let res = await myDefiContract.methods.swapExactTokensForTokens(bigamount, 1, path, klaytn.selectedAddress, timestamp).send({ from: klaytn.selectedAddress, gas: 1000000});
            // console.log(res);
            return res.transactionHash;
        }
    else if (tokenB == "KLAY") {
            await approve(tokenA, dex);
            path[1] = "0x5819b6af194a78511c79c85ea68d2377a7e9335f";
            // let res = await Router.methods.swapExactTokensForETH(bigamount, 1, path, myWalletAddress, timestamp).send({ from: myWalletAddress, gas: 1000000 });
            let res = await myDefiContract.methods.swapExactTokensForETH(bigamount, 1, path, klaytn.selectedAddress, timestamp).send({ from: klaytn.selectedAddress, gas: 1000000});
            // console.log(res);
            return res.transactionHash;
        }
    else console.log("\n\n\n\n\n\n\nn\\n\n\\n\n\\n\\n\n\\n\\n\\n\n\\n\\n\\n\n\\n\n");
    }
}
async function SmartSwapRouting (tokenA, tokenB, howmany) {
    await prepareMatrix(tokenA, tokenB, howmany);
    var amount = howmany;
    console.log(data)
    for (var j = 0; j < data.length; j++) {
        var params = data[j].split(',');
        console.log('\n');
        console.log( "   swap " + (j + 1) + " ================================================= \n")
        console.log(params)
        console.log(params[0] + " to swap : " + amount)
        if (params[3] != 0 && params[5] != 0) {
            console.log("1")
            var amount_Ksp = safemath.safeMule(safemath.safeDiv(params[3], safemath.safeAdd(params[3], params[5])), amount)
            var amount_Def = safemath.safeMule(safemath.safeDiv(params[5], safemath.safeAdd(params[3], params[5])), amount)

            amount_Ksp = await getSwappedAmount(await SwapRouting(params[0], params[1], amount_Ksp, params[2]), params[1]);
            amount_Def = await getSwappedAmount(await SwapRouting(params[0], params[1], amount_Def, params[4]), params[1]);

            amount = safemath.safeAdd(amount_Ksp, amount_Def);
        }
        else if (params[3] != 0){
            console.log("2")
            amount = await getSwappedAmount(await SwapRouting(params[0], params[1], amount, params[2]), params[1]);
        }
        else if (params[5] != 0){
            console.log("3")
            amount = await getSwappedAmount(await SwapRouting(params[0], params[1], amount, params[4]), params[1]);
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

// execute('KUSDT', 'KLAY', "3.652481");
// SmartSwapRouting('KUSDT', 'KLAY', "3.731073");
// 0.

// module.exports = {
//     ShowRouting,
//     SwapRouting,
//     execute,
//     SmartSwapRouting
// }
export {
    SwapRouting,
    ShowRouting,
    SmartSwapRouting
}
