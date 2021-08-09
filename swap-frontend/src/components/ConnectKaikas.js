import {Button} from "@material-ui/core";
import React from "react";

export const ConnectKaikas = (props) => {
    const klaytn = props.klaytn;

    const connectWallet = async() => {
        console.log("connectWallet is clicked")
        try {
            const accounts = await klaytn.enable();
            const account = accounts[0];
            console.log("account", account)
            getNetwork();
            getAccount();
        } catch (error) {
            console.log(error)
        }
    }

    const getNetwork = async() => {
        const network = await klaytn.networkVersion
        if (network===8217){
            console.log("cypress main network")
        } else if (network===1001){
            console.log("baobab test network")
        }
    }

    const getAccount = async() => {
        let account;
        account = await klaytn.selectedAddress
        console.log("account in getAccount()", account)
        // klaytn.on('accountsChanged', (accounts) => {
        //     account = accounts[0];
        //     console.log("user changed her account to ", account)
        // })
        return account;
    }

    return (
        <Button onClick = {()=>connectWallet()}
            style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
        Connect your Kaikas wallet
        </Button>
    )
}