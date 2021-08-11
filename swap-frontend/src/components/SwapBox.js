import {Box, TextField} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {BigNumberInput} from "big-number-input";
import {SelectToken} from "./SwapBoxHelper/SelectToken";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {SwapButton} from "./SwapBoxHelper/SwapButton";
import {SwapButtonTest} from "./SwapBoxHelper/SwapButtonTest";
import {RouteTable} from "./SwapBoxHelper/RouteTable";

import {klaytn, caver} from "./caver";
import {ShowRouting} from "./navi_v3.js";

export const SwapBox = () => {
    const tokenList = require("./tokenList.json");
    const dummyToken = {
        "id": "Dummy",
        "label": "",
        "decimals": 0,
        "address": ""
    }

    const [tokenInAmount, setTokenInAmount] = useState(0);
    const [tokenOutAmount, setTokenOutAmount] = useState(0);
    const [fromToken, setFromToken] = useState(dummyToken);
    const [toToken, setToToken] = useState(dummyToken);
    const [myWalletAddress, setMyWalletAddress] = useState("");
    const [routing, setRouting] = useState("");

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

    useEffect(()=>{
        const showRouting = async() => {
            const routing = await ShowRouting (fromToken.label, toToken.label, tokenInAmount);
            setRouting(routing.path);
            console.log("routing", routing);

            const estimated = routing.money;
            setTokenOutAmount(estimated);
            console.log("tokenOutAmount", tokenOutAmount)
        }
        showRouting();
        console.log("routing in swapbox", routing)
    },[fromToken,toToken,tokenInAmount])

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
                {/*<BigNumberInput*/}
                {/*    decimals={fromToken.decimals} onChange={changeTokenInAmount}*/}
                {/*    value={tokenInAmount} renderInput={props => <Input {...props} />}*/}
                {/*    style = {{ color: "#3A2A17", padding: "15px 20px", fontSize: "15px" }}*/}
                {/*/>*/}
            {/*    <TextInput*/}
            {/*        style={styles.input}*/}
            {/*        onChangeText={onChangeNumber}*/}
            {/*        value={number}*/}
            {/*        placeholder=“useless placeholder”*/}
            {/*    keyboardType=“numeric”*/}
            {/*/>*/}
            {/*    <InputLabel>token amount</InputLabel>*/}
            {/*    <Input id="input" value={tokenInAmount} onChange={changeTokenInAmount} />*/}
                <TextField style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}
                    type="number" format="none" value={tokenInAmount} onChange ={(e)=>changeTokenInAmount(e.target.value)}
                           // InputProps={{ classes: { input: classes.textfield1 }, }}
                />
                <div> {fromToken.label} </div>
                <SelectToken setFromOrToToken={setFromToken}/>
            </Box>
            <ArrowDownwardIcon style = {{color: "#3A2A17", marginTop: "10px", marginBottom: "10px"}} />
            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    To (estimated)
                </p>
                <TextField style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}
                           type="number" format="none" value={tokenOutAmount}
                />
                <div> {toToken.label} </div>
                <SelectToken setFromOrToToken={setToToken}/>
            </Box>
            <SwapButton caver={caver} myWalletAddress={myWalletAddress} tokenInLabel={fromToken.label}
                        tokenOutLabel={toToken.label} tokenInAmount={tokenInAmount} slippage={5}/>
            <SwapButtonTest/>
            <RouteTable routing={routing}/>
        </Box>
    )
}