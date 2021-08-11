import {Box, Input} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {BigNumberInput} from "big-number-input";
import {SelectToken} from "./SwapBoxHelper/SelectToken";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {SwapButton} from "./SwapBoxHelper/SwapButton";
import {klaytn, caver} from "./caver";

export const SwapBox = () => {
    const tokenList = require("./tokenList.json");

    const [tokenInAmount, setTokenInAmount] = useState();
    const [fromToken, setFromToken] = useState(tokenList[0]);
    const [toToken, setToToken] = useState(tokenList[0]);
    const [myWalletAddress, setMyWalletAddress] = useState("");

    console.log("fromToken:", fromToken.label, "toToken: ", toToken.label)

    //check my selected wallet address
    useEffect(()=>{
        const checkMyWalletAddress = async() => {
            const myWalletAddress = await klaytn.selectedAddress
            // console.log("account in getAccount()", account)
            // klaytn.on('accountsChanged', (accounts) => {
            //     account = accounts[0];
            //     console.log("user changed her account to ", account)
            // })
            setMyWalletAddress(myWalletAddress);
        }
        checkMyWalletAddress();
        console.log("mywalletAddress", myWalletAddress)
    })

    const changeTokenInAmount = async(value) => {
        await setTokenInAmount(value);
        console.log("tokenInAmount", tokenInAmount);
    }

    return(
        <Box style = {{ color: "#3A2A17", padding: "30px 30px", fontSize: "15px", backgroundColor: "#FFFDD0" }}>
            <div> Kaikas wallet is connected </div>
            <p style = {{fontSize: "20px", textAlign: "left"}}>
                Swap
            </p>

            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    From
                </p>
                <BigNumberInput
                    decimals={fromToken.decimals} onChange={changeTokenInAmount}
                    value={tokenInAmount} renderInput={props => <Input {...props} />}
                    style = {{ color: "#3A2A17", padding: "15px 20px", fontSize: "15px" }}
                />
                <div> {fromToken.label} </div>
                <SelectToken setFromOrToToken={setFromToken}/>
            </Box>
            <ArrowDownwardIcon style = {{color: "#3A2A17", marginTop: "10px", marginBottom: "10px"}} />
            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    To
                </p>
                <div> {toToken.label} </div>
                <SelectToken setFromOrToToken={setToToken}/>
            </Box>
            <SwapButton caver={caver} myWalletAddress={myWalletAddress} tokenInAddress={fromToken.address}
                        tokenOutAddress={toToken.address} tokenInAmount={tokenInAmount} slippage={5}/>
        </Box>
    )
}