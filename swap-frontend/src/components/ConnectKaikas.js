import {Button} from "@material-ui/core";
import React from "react";

export const ConnectKaikas = (props) => {
    const klaytn = props.klaytn;
    const setMyWalletAddress = props.setMyWalletAddress

    const connectWallet = async() => {
        console.log("connectWallet is clicked")
        try {
            const accounts = await klaytn.enable();
            console.log("my wallet address:", accounts[0])
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Button onClick = {()=>connectWallet()}
                style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
            Connect your Kaikas wallet
        </Button>
    )
}