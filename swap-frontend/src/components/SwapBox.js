import {Box, TextField} from "@material-ui/core";
import React, {useEffect, useState} from "react";
// import {BigNumberInput} from "big-number-input";
import {SelectToken} from "./SwapBoxHelper/SelectToken";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import {SwapButton} from "./SwapBoxHelper/SwapButton";
// import {SwapButtonTest} from "./SwapBoxHelper/SwapButtonTest";
import {RouteTable} from "./SwapBoxHelper/RouteTable";
import {RefreshButton} from "./RefreshButton";
import {klaytn, caver} from "./caver";

const navi = require('./navi_v3')

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
    const [slippage, setSlippage] = useState(undefined);
    const [refresh, setRefresh] = useState(false);

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

    //without refresh
    useEffect( async ()=>{
        const checkRouting = async() => {
            const routing = await navi.ShowRouting (fromToken.label, toToken.label, tokenInAmount);
            setRouting(routing.path);

            const estimated = routing.money;
            setTokenOutAmount(estimated);

            const slippage = routing.slippage;
            setSlippage(slippage);
        }

        await checkRouting();
        console.log("routing in swapbox", routing)
        console.log("tokenOutAmount in swapbox", tokenOutAmount)
        console.log("slippage in swapbox", slippage)

    },[fromToken,toToken,tokenInAmount])

    // with refresh
    useEffect( async ()=>{
        if(!refresh) {
            console.log("refresh0",refresh)
            return;
        }
        console.log("refresh1",refresh)

        const checkRouting = async() => {
            const routing = await navi.ShowRouting (fromToken.label, toToken.label, tokenInAmount);
            setRouting(routing.path);

            const estimated = routing.money;
            setTokenOutAmount(estimated);

            const slippage = routing.slippage;
            setSlippage(slippage);
        }

        await checkRouting();
        console.log("routing in swapbox", routing)
        console.log("tokenOutAmount in swapbox", tokenOutAmount)
        console.log("slippage in swapbox", slippage)
        setRefresh(false);
        console.log("refresh2",refresh)

    },[fromToken,toToken,tokenInAmount,refresh])

    const refreshRouting = () => {
        setRefresh(true);
    }

    return(
        <Box style = {{ color: "#3A2A17", padding: "30px 30px", fontSize: "15px", backgroundColor: "#FFFDD0" }}>
            <div> Kaikas wallet is connected </div>
            <p style = {{fontSize: "20px", textAlign: "left"}}>
                Swap
            </p>

            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10, marginLeft: 30, marginRight: 30, marginTop: 30 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    From
                </p>
                {/*<BigNumberInput*/}
                {/*    decimals={fromToken.decimals} onChange={changeTokenInAmount}*/}
                {/*    value={tokenInAmount} renderInput={props => <Input {...props} />}*/}
                {/*    style = {{ color: "#3A2A17", padding: "15px 20px", fontSize: "15px" }}*/}
                {/*/>*/}
                <TextField style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}
                    type="number" format="none" value={tokenInAmount} onChange ={(e)=>changeTokenInAmount(e.target.value)}
                           // InputProps={{ classes: { input: classes.textfield1 }, }}
                />
                <div> {fromToken.label} </div>
                <SelectToken setFromOrToToken={setFromToken}/>
            </Box>
            <ArrowDownwardIcon style = {{color: "#3A2A17", marginTop: "10px", marginBottom: "10px"}} />
            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10, marginLeft: 30, marginRight: 30 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    To (estimated)
                </p>
                <TextField style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10}}
                           type="number" format="none" value={tokenOutAmount}
                />
                <div> {toToken.label} </div>
                <SelectToken setFromOrToToken={setToToken}/>
            </Box>
            <SwapButton tokenInLabel={fromToken.label} tokenOutLabel={toToken.label} tokenInAmount={tokenInAmount}/>
            {/*<SwapButtonTest/>*/}
            <div>
                {!(slippage && routing) ?
                    <div></div>
                    :
                    <div>
                    <RouteTable routing={routing} slippage={slippage} refreshFunction={()=>refreshRouting()}/>
                    <RefreshButton refreshFunction={()=>refreshRouting()} />
                    </div>
                }
            </div>
        </Box>
    )
}