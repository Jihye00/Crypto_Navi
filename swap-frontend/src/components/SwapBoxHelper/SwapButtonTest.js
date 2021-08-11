import {Button} from "@material-ui/core";
import React from "react";
import {klaytn, caver} from "../caver";
import {BigNumber} from "bignumber.js";

const abi = require('../Data/FactoryImpl.json');
const abi_definix = require('../Data/DefinixRouter.json');
const Kip7Abi = require('../Data/Kip7Abi.json');


export const SwapButtonTest = () => {
    // const myWalletAddress = props.myWalletAddress;
    // const tokenInLabel = props.tokenInLabel
    // const tokenOutLabel = props.tokenOutLabel
    // const tokenInAmount = props.tokenInAmount
    //slippage in percentage
    // const slippage = props.slippage

    async function approve(dex) {

        const Kip7 = new caver.klay.Contract(Kip7Abi, "0xef82b1c6a550e730d8283e1edd4977cd01faf435");// 수정

        var approveAddress = '';
        if (dex == 'KLAYSWAP') {
            approveAddress = "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654";
        }
        else approveAddress = "0x4E61743278Ed45975e3038BEDcaA537816b66b5B";

        let currentAllowance = await Kip7.methods.allowance(klaytn.selectedAddress, approveAddress).call();
        console.log("currentAllowance", currentAllowance);
        // 0 current allowance means token has not been approved yet
        if (currentAllowance == 0) {
            // approve router to transact the kip-7 token and set allowance to maximum uint256
            let allowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            await Kip7.methods.approve(approveAddress, allowance)
                .send({ from: klaytn.selectedAddress, gas: 1000000 },
                function(error, transactionHash) {
                    console.log(transactionHash)
                });
        }
    };

    const swapTest = async() => {
        await approve("KLAYSWAP");
        const myContract = new caver.klay.Contract(abi.abi, '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654')
        const empty = [];
        await myContract.methods.exchangeKctPos("0xef82b1c6a550e730d8283e1edd4977cd01faf435",
            "100000000000000000", "0x0000000000000000000000000000000000000000", 1, empty)
            .send({from: klaytn.selectedAddress, gas: 1000000},
            function(error, transactionHash) {
            console.log(transactionHash)
            });
    }

    return(
        <Button onClick = {()=>swapTest()}
                style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
            swap test
        </Button>
    )
}