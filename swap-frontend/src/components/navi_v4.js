import {klaytn, caver} from "./caver";
import {BigNumber} from 'bignumber.js';
// const BigNumber = require('bignumber.js');

const test = require('./Data/test_v4.js');
const type = require('./Algorithm/type_v4.js');
const safemath = require("safemath");
const shifts = require('./Data/shifts.js')
const abi = require('./Data/FactoryImpl.json');
const abi_definix = require('./Data/DefinixRouter.json');
const Kip7Abi = require('./Data/Kip7Abi.json');

const empty = [];
var data, data_full;
const NAVI_ADDRESS = "";

async function approveNAVI(contractAddress = NAVI_ADDRESS) {
    let currentAllowance = await Kip7.methods.allowance(klaytn.selectedAddress, contractAddress).call();
    console.log("currentAllowance", currentAllowance, typeof(currentAllowance));
    
    if (currentAllowance === "0") {
        console.log("current allowance is 0");
        let allowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        console.log("allowance",allowance)
        await Kip7.methods.approve(contractAddress, allowance)
            .send({from: klaytn.selectedAddress, gas: 1000000 });
    }
}

async function approve(tokenname, dex) {
    const Kip7 = new caver.klay.Contract(Kip7Abi, test.TOKEN_ADDRESS[tokenname]);// 수정
    var approveAddress = "";
    if (dex == 'KLAYSWAP') {
        approveAddress = '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654';
    }
    else {approveAddress = '0x4E61743278Ed45975e3038BEDcaA537816b66b5B';
        let currentAllowance = await Kip7.methods.allowance(klaytn.selectedAddress, approveAddress).call();
        console.log('currentAllowance', currentAllowance);
        // 0 current allowance means token has not been approved yet
        if (currentAllowance == 0) {
            // approve router to transact the kip-7 token and set allowance to maximum uint256
            let allowance = new BigNumber('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
            await Kip7.methods.approve(approveAddress, allowance)
                .send({ from: klaytn.selectedAddress, gas: 1000000 },
                    function(error, transactionHash) {
                        console.log("approve clear")
                });
        }
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
    var route_row = new type.Route_Row(type.CurrencyLists, tokenA);

    route_row.calc(20, howmany);
    var indexB = type.index_finder(tokenB);
    console.log('NAVI RESULT: ', route_row.row[indexB]);
    // data['slippage'] = 100 * (1 - data['slippage'])
    data = route_row.row[indexB].path;
    data_full = route_row.row[indexB];
}

async function getSwappedAmount(txhash, tokenname) {
    let tx = await caver.klay.getTransactionReceipt(txhash);
    for (let n in tx.logs) {
      if ((tx.logs[n].address).toUpperCase() == (test.TOKEN_ADDRESS[tokenname]).toUpperCase()) {

        let res ='';
        res += caver.abi.decodeParameter('uint256', tx.logs[n].data);
        console.log("if curious tx address : " + txhash);
        console.log(tokenname + " swapped : " + shifts.lshift(res, test.TOKEN_DECIMAL[tokenname]));

        return await shifts.lshift(res, test.TOKEN_DECIMAL[tokenname]);
      }
    }
    console.log("swapped currency data not found")
}

async function ShowRouting (tokenA = '', tokenB = '', howmany = -1) {
    if (tokenA == '' || tokenB == '' || howmany <= 0){
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
            let res = await myKlayContract.methods.exchangeKlayPos(test.TOKEN_ADDRESS[tokenB], 1, empty)
                .send({from: klaytn.selectedAddress, gas: 1000000, value: bigamount},
                function(error, transactionHash) {console.log(transactionHash)});
            return res.transactionHash;
        }
        else if (tokenA != "KLAY") {

            await approve(tokenA, dex);
            let res = await myKlayContract.methods.exchangeKctPos(test.TOKEN_ADDRESS[tokenA], bigamount, test.TOKEN_ADDRESS[tokenB], 1, empty).send({from: klaytn.selectedAddress, gas: 1000000},
                function(error, transactionHash) {console.log(transactionHash)});
            return res.transactionHash;
        }
        else console.log("KLAYSWAP Corner Case!!!");
        }
    let path = [test.TOKEN_ADDRESS[tokenA], test.TOKEN_ADDRESS[tokenB]];
    if (dex == "DEFINIX") {
        console.log("entered DEFINIX")
        const myDefiContract = new caver.klay.Contract(abi_definix, "0x4E61743278Ed45975e3038BEDcaA537816b66b5B")
        let timestamp = Date.now() + 1000 * 60 * 15;
        if (tokenA == "KLAY") {
            path[0] = "0x5819b6af194a78511c79c85ea68d2377a7e9335f";
            let res = await myDefiContract.methods.swapExactETHForTokens(1, path, klaytn.selectedAddress, timestamp).send({ from: klaytn.selectedAddress, gas: 1000000, value: bigamount });

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
    await approveNAVI();
    // await ShowRouting(tokenA, tokenB, howmany);
    let input = [];
    for (var j2 = 0; j2 < data.length; j2++) {
        var params = data[j2].split(',');
        // var amount_Ksp = BigNumber(await shifts.lshift(safemath.safeMule(safemath.safeDiv(params[3], safemath.safeAdd(params[3], params[5])), amount).toString(), -1*test.TOKEN_DECIMAL[params[0]]));
        // var amount_Def = BigNumber(await shifts.lshift(safemath.safeMule(safemath.safeDiv(params[5], safemath.safeAdd(params[3], params[5])), amount).toString(), -1*test.TOKEN_DECIMAL[params[0]]));
        var amount_Ksp = BigNumber(await shifts.lshift(params[3].toString(), -1*test.TOKEN_DECIMAL[params[0]]));
        var amount_Def = BigNumber(await shifts.lshift(params[5].toString(), -1*test.TOKEN_DECIMAL[params[0]]));
        input.push({from:test.TOKEN_ADDRESS[params[0]], to:test.TOKEN_ADDRESS[params[1]], kspAmount:amount_Ksp, defAmount:amount_Def});
    }
    console.log(input)

    // NAVI contract call
}

async function execute (tokenA, tokenB, amount) {
    await ShowRouting(tokenA, tokenB, amount);
    await SwapRouting(tokenA, tokenB, amount);
}

// ShowRouting('KLAY', 'KUSDT', 10);
// SmartSwapRouting('KLAY', 'KUSDT', 10);
// execute('KUSDT', 'KLAY', "3.652481");
// SmartSwapRouting('KUSDT', 'KLAY', "3.731073");

export {
    SwapRouting,
    ShowRouting,
    SmartSwapRouting
}
