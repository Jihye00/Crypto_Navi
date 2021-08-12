import {Button} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {SmartSwapRouting} from "../navi_v3";
// import {Popup} from "reactjs-popup";
import Alert from "@material-ui/lab/Alert";

export const SwapButton = (props) => {
    const [isSwapSuccess, setIsSwapSuccess] = useState(false);

    const tokenInLabel = props.tokenInLabel
    const tokenOutLabel = props.tokenOutLabel
    const tokenInAmount = props.tokenInAmount
    console.log(tokenInLabel,tokenOutLabel,tokenInAmount)

    const swap = async() => {
        const swapSuccess = await SmartSwapRouting(tokenInLabel, tokenOutLabel, tokenInAmount);
        console.log("swapSuccess", swapSuccess);
        setIsSwapSuccess(swapSuccess);
    }

    useEffect(() => {
        if(isSwapSuccess) {
            const timeId = setTimeout(() => {
                console.log("timeout")
                // After 3 seconds set the show value to false
                disableAlert()
            }, 5000)
            return () => {
                clearTimeout(timeId)
            }
        }
    }, [isSwapSuccess]);

    const disableAlert = () => {
        setIsSwapSuccess(false);
    }

    return(
        <div>
            <Button onClick = {()=>swap()}
                    style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginBottom: "20px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
                swap
            </Button>
            <div>
            {!isSwapSuccess ?
                <div></div>
                :
                <Alert onClose={disableAlert} severity="success">
                    Swap was successful
                </Alert>
            }
            </div>
        </div>
    )
}