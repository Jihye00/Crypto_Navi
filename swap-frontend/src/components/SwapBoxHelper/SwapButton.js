import {Button} from "@material-ui/core";
import React from "react";

export const SwapButton = (props) => {
    const caver = props.caver
    const myWalletAddress = props.myWalletAddress;
    const tokenInAddress = props.tokenInAddress
    const tokenOutAddress = props.tokenOutAddress
    const tokenInAmount = props.tokenInAmount
    //slippage in percentage
    const slippage = props.slippage

    const swap = async() => {

        //make Dfx Router instance
        const DfxRouterAddress = "0x4E61743278Ed45975e3038BEDcaA537816b66b5B";
        const RouterAbi = require('../../DfxRouterAbi.json');
        const DfxRouter = new caver.contract(RouterAbi, DfxRouterAddress);
        console.log("DfxRouter", DfxRouter)

        //make Kip7 instance
        const Kip7Abi = require("../../Kip7Abi.json");
        const Kip7 = new caver.contract(Kip7Abi, tokenInAddress);


        //calculate minimum amount of tokens we should receive after swap
        let amountOutMin;
        let getAmountOutMin = async() => {
            const amountIn = caver.utils.toBN(tokenInAmount)
            console.log("amountIn", amountIn.toString())
            const amounts = await DfxRouter.methods.getAmountsOut(amountIn, [tokenInAddress, tokenOutAddress]).call();
            const amountOut = caver.utils.toBN(amounts[1]);
            console.log("amountOut", amountOut.toString())

            //consider slippage
            const slippageMultiplier = caver.utils.toBN((100-slippage).toString());
            console.log("slippageMultiplier",slippageMultiplier.toString())
            const slippageDivider = caver.utils.toBN((100).toString());
            console.log("slippageDivider",slippageDivider.toString())
            amountOutMin = amountOut.mul(slippageMultiplier).div(slippageDivider);
            console.log("amountOutMin",amountOutMin.toString(), caver.utils.isBN(amountOutMin));
        }

        // if token is not approved, approve the token
        let approveRouter = async() => {
            let currentAllowance = await Kip7.methods.allowance(myWalletAddress,DfxRouterAddress).call();
            // 0 current allowance means token has not been approved yet
            if (currentAllowance===0){
                console.log("not approved yet")
                // approve router to transact the kip-7 token and set allowance to maximum uint256
                let allowance = caver.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
                await Kip7.methods.approve(DfxRouterAddress, allowance).send({from: myWalletAddress, gas: 1000000 });
            } else {
                console.log("already approved")
            }
        }

        // execute the swap
        let executeSwap = async() => {
            const amountIn = caver.utils.toBN(tokenInAmount)
            let tx = await DfxRouter.methods.swapExactTokensForTokens(
                amountIn, amountOutMin, [tokenInAddress,tokenOutAddress], myWalletAddress, Date.now() + 1000 * 60 * 5)
                .send({ from: myWalletAddress, gas: 1000000 });
            console.log(tx);
        }

        let startSwap = async() => {
            await getAmountOutMin();
            await approveRouter();
            await executeSwap();
        }
        startSwap();
    }
    return(
        <Button onClick = {()=>swap()}
                style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
            swap
        </Button>
    )
}