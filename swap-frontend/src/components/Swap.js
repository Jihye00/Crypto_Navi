import {Button} from "@material-ui/core";
import React from "react";
// import navi_v3 from "navi_v3.js";
// const execute = require('./navi_v3.js');
// const SmartSwapRouting = require('./navi_v3.js');

export const Swap = (props) => {
    const caver = props.caver
    const myWalletAddress = props.myWalletAddress;
    const tokenInAddress = props.tokenInLabel
    const tokenOutLabel = props.tokenOutLabel
    const tokenInAmount = props.tokenInAmount
    //slippage in percentage
    const slippage = props.slippage

    const swap = async() => {
        // execute(tokenInLabel, tokenOutLabel, tokenInAmount)
    }
    return(
        <Button onClick = {()=>swap()}
                style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
            swap
        </Button>
    )
}