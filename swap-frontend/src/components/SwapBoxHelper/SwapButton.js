import {Button} from "@material-ui/core";
import React from "react";
import {SmartSwapRouting} from "../navi_v3";
// const navi = require('../navi_v3')

export const SwapButton = (props) => {
    // const caver = props.caver
    // const myWalletAddress = props.myWalletAddress;
    const tokenInLabel = props.tokenInLabel
    const tokenOutLabel = props.tokenOutLabel
    const tokenInAmount = props.tokenInAmount
    console.log(tokenInLabel,tokenOutLabel,tokenInAmount)
    //slippage in percentage
    // const slippage = props.slippage

    const swap = async() => {
        console.log("11111111111")
        await SmartSwapRouting(tokenInLabel, tokenOutLabel, tokenInAmount);
    }

    return(
        <Button onClick = {()=>swap()}
                style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginBottom: "20px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
            swap
        </Button>
    )
}