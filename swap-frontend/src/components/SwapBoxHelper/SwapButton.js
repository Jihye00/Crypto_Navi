import {Button} from "@material-ui/core";
import React from "react";
import {SwapRouting} from "../navi_v3.js";


export const SwapButton = (props) => {
    // const caver = props.caver
    // const myWalletAddress = props.myWalletAddress;
    const tokenInLabel = props.tokenInLabel
    const tokenOutLabel = props.tokenOutLabel
    const tokenInAmount = props.tokenInAmount
    //slippage in percentage
    // const slippage = props.slippage

    const swap = async() => {
        await SwapRouting(tokenInLabel, tokenOutLabel, tokenInAmount);
    }

    return(
        <Button onClick = {()=>swap()}
                style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
            swap
        </Button>
    )
}