const Caver = require ("caver-js");
const BigNumber = require("bignumber.js");
const kip7Abi = require("./kip7Abi.json");

const cypressNode = "https://kaikas.cypress.klaytn.net:8651";
const caver = new Caver(cypressNode);

// const myWalletAddress = "0x3a7d1d4ec33faa64827ca8f4f17f747834121004"
//checksum myWalletAddress
const myWalletAddress = "0x3A7d1D4Ec33faA64827CA8f4f17F747834121004"

const testContractAddress = "0xA8074c4afa0B4855D5428f39ad9D577C97Ab6C0b"

//Keth
const tokenAddress = "0x34d21b1e550d73cee41151c77f3c73359527a396"

const token2Address = "0x5819b6af194A78511c79C85Ea68D2377a7e9335f"

//Kusdt
// const tokenAddress = "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167";

// Wklay
// const tokenAddress = "0x5819b6af194A78511c79C85Ea68D2377a7e9335f";

//Klay -> do not approve Klay (execution reverted for approve function because no need to approve Klay)
// failed to transfer Klay to contract address using VALUE_TRANSFER from caver js
// const tokenAddress = "0x0000000000000000000000000000000000000000";
// const amount = "10000000000000000"

const keyring = caver.wallet.keyring.createFromPrivateKey("0x6247842d09089e89d56ed81d91cccafc59d30db542077ca25fe0e83eeadc879a")
// console.log("keyring", keyring)
caver.wallet.add(keyring);
// console.log("caver.wallet", caver.wallet)

const approveTestContract = async() => {
    const kip7Abi = require("./kip7Abi.json");
    const tokenInstance = new caver.contract(kip7Abi, tokenAddress);

    let currentAllowance = await tokenInstance.methods.allowance(myWalletAddress,testContractAddress).call();
    console.log("currentAllowance", currentAllowance, typeof(currentAllowance));

    // 0 current allowance means token has not been approved yet
    if (currentAllowance==="0"){
        console.log("current allowance is 0")
        // approve test contract to transact the kip-7 token and set allowance to maximum uint256
        let allowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        console.log("allowance",allowance)
        await tokenInstance.methods.approve(testContractAddress, allowance).send({from: myWalletAddress, gas: 1000000 });
    }

    const token2Instance = new caver.contract(kip7Abi, token2Address);
    let allowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    console.log("allowance",allowance)
    await token2Instance.methods.approve(testContractAddress, allowance).send({from: myWalletAddress, gas: 1000000 });
}

const testDefinixSwap = async() => {
    const testContractAbi = require("./testAbi.json");
    const testContract = new caver.contract(testContractAbi, testContractAddress)
    //for contract with deposit function
    // await testContract.methods.deposit().send({from: myWalletAddress, gas: 1000000, value: amount});
    //for contract with swapEth
    // await testContract.methods.definixSwapKlay("0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167").send({from: myWalletAddress, gas: 1000000, value: amount})
    //     .then(function(amountB){console.log(amountB)});
    await testContract.methods.swapDefinix("0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167", "0x0000000000000000000000000000000000000000", "100000")
        .send({from: myWalletAddress, gas: 1000000, value: "100000"})
        .then(function(amountB){console.log(amountB)});
}

const testMainSwap = async() => {
    const testContractAbi = require("./testAbi.json");
    const testContract = new caver.contract(testContractAbi, testContractAddress)

    await testContract.methods.main([{_from : "0x34d21b1e550d73cee41151c77f3c73359527a396", _to : "0x0000000000000000000000000000000000000000", _kspAmount : "0", _defAmount : "100000000000000", _kspLP : "0x27f80731dddb90c51cd934e9bd54bff2d4e99e8a"},{_from : "0x0000000000000000000000000000000000000000", _to : "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167", _kspAmount : "1000000000000000000", _defAmount : "0", _kspLP : "0xd83f1b074d81869eff2c46c530d7308ffec18036"}])
        .send({from: myWalletAddress, gas: 1000000, value: "0"}).then(console.log);
}

// const testSwapKlayswap = async() => {
//     const testContractAbi = require("./testAbi.json");
//     const testContract = new caver.contract(testContractAbi, testContractAddress)
//
//     await testContract.methods.swapKlayswap("0x0000000000000000000000000000000000000000", "0x34d21b1e550d73cee41151c77f3c73359527a396", "10000000000000000", "0x27f80731dddb90c51cd934e9bd54bff2d4e99e8a")
//         .send({from: myWalletAddress, gas: 1000000, value: "10000000000000000"})
//
//     await testContract.methods.kslp().call().then(console.log);
// }

const start = async() => {
    // If you want to swap token other than Klay (approve test contract first before testing)
    await approveTestContract();
    // If you want to swap Klay (test swap eth after deploying)
    // await testDefinixSwap();
    // If you want to test swap main function
    await testMainSwap();
    // If you want to test swapKlaySwap function
    // await testSwapKlayswap();
}

start();

// const transferEther = async(amount) => {
//     const account = caver.klay.accounts.wallet.add("0x6247842d09089e89d56ed81d91cccafc59d30db542077ca25fe0e83eeadc879a")
//
//     //error: this type transaction cannot be sent to contract addresses sending klay from one of my wallet addresses to test contract
//     // caver.klay.sendTransaction({
//     //     type: 'VALUE_TRANSFER',
//     //     //account.address is the same as myWalletAddress
//     //     from: account.address,
//     //     to: testContractAddress,
//     //     gas: '300000',
//     //     value: caver.utils.toPeb(amount.toString(), 'KLAY'),
//     // }).on('receipt', function(receipt){
//     //     console.log("receipt", receipt)
//     // }).on('error', console.error);
//
//     // success sending klay from one of my wallet addresses to another
//     // caver.klay.sendTransaction({
//     //     type: 'VALUE_TRANSFER',
//     //     //account.address is the same as myWalletAddress
//     //     from: account.address,
//     //     //my other wallet address
//     //     to: "0xcb5165b0e06179f7f291eb13d0702de62d3721c9",
//     //     gas: '300000',
//     //     value: 10000000000000000,
//     // }).on('receipt', function(receipt){
//     //     console.log("receipt", receipt)
//     // }).on('error', console.error);
// }
//
// const executeTransfer = async(amount) => {
//     await transferEther(amount);
// }