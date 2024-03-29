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
import FINIX from "./TokenIcon/FINIX.png";
import KBNB from "./TokenIcon/KBNB.png";
import KDAI from "./TokenIcon/KDAI.png";
import KETH from "./TokenIcon/KETH.png";
import KLAY from "./TokenIcon/KLAY.png";
import KORC from "./TokenIcon/KORC.png";
import KSP from "./TokenIcon/KSP.png";
import KUSDT from "./TokenIcon/KUSDT.png";
import KWBTC from "./TokenIcon/KWBTC.png";
import KXRP from "./TokenIcon/KXRP.png";
import SIX from "./TokenIcon/SIX.png";
import {SwapSuccess} from "./SwapSuccess";
import {SwapError} from "./SwapError";

const navi = require('./navi_v4')

export const SwapBox = (props) => {
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
    const [routing, setRouting] = useState([]);
    const [slippage, setSlippage] = useState(1);
    const [refresh, setRefresh] = useState(false);
    const [isSwapSuccess, setIsSwapSuccess] = useState(undefined);
    const [isTokenInAmountDisabled, setIsTokenInAmountDisabled] = useState(false);

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

    const setTokenInAmountToUndefined = () => {
        setTokenInAmount(undefined);
        console.log("setTokenInAmountToUndefined")
    }
    const setTokenOutAmountToUndefined = () => {
        setTokenOutAmount(undefined);
        console.log("setTokenOutAmountToUndefined")
    }

    const disableTokenInAmount = () => {
        setIsTokenInAmountDisabled(true);
        console.log("disableTokenInAmount")
    }

    const enableTokenInAmount = () => {
        setIsTokenInAmountDisabled(false);
        console.log("enableTokenInAmount")
    }

    useEffect(async()=> {
        if((toToken===fromToken) && (toToken.id!=="Dummy") && (fromToken.id!=="Dummy")) {
            await setTokenOutAmountToUndefined();
            await disableTokenInAmount();
            await setTokenInAmount(0);
        } else{
            await enableTokenInAmount();
        }
    },[fromToken,toToken])

    useEffect(async ()=>{
        if (tokenInAmount===undefined || tokenInAmount===0) {
            await setTokenOutAmountToUndefined();
        } else if (tokenInAmount<=0.0001) {
            await setTokenInAmountToUndefined();
            // await setTokenOutAmountToUndefined();
            await setTokenOutAmount(0);
            await setRouting([]);
        }
    },[tokenInAmount])

    //without refresh
    useEffect( async() => {
            const checkRouting = async() => {
            const routing = await navi.ShowRouting (fromToken.label, toToken.label, tokenInAmount);
            const routingPath = routing.path

            if(routingPath===[]) {
                setTokenOutAmount(undefined);
                setTokenInAmount(undefined);
                setRouting([])
            }
            console.log("routingPath",routingPath)
            setRouting(routingPath);

            const estimated = routing.money;
            setTokenOutAmount(estimated);

            const slippage = Number(routing.slippage);
            setSlippage(slippage);
            }

        if(fromToken.label !== "" && toToken.label !== "" && !isNaN(tokenInAmount) && tokenInAmount>0.0001) {
            await checkRouting();
            console.log("routing in swapbox", routing)
            console.log("tokenOutAmount in swapbox", tokenOutAmount)
            console.log("slippage in swapbox", slippage, typeof(slippage))
        }
        // else{
        //     setTokenOutAmount(0);
        //     setSlippage(0);
        //     setRouting("");
        // }

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
            const routingPath = routing.path;

            if(routingPath===[]) {
                setTokenOutAmount(undefined);
                setTokenInAmount(undefined);
                setRouting([])
            }
            console.log("routingPath",routingPath)
            setRouting(routingPath);

            const estimated = routing.money;
            setTokenOutAmount(estimated);

            const slippage = Number(routing.slippage);
            setSlippage(slippage);
        }

        if(fromToken.label !== "" && toToken.label !== "" && !isNaN(tokenInAmount) && tokenInAmount>0.0001) {
            await checkRouting();
            console.log("routing in swapbox", routing)
            console.log("tokenOutAmount in swapbox", tokenOutAmount)
            console.log("slippage in swapbox", slippage)
            setRefresh(false);
            console.log("refresh2",refresh)
        }
        // else{
        //     setTokenOutAmount(0);
        //     setSlippage(0);
        //     setRouting("");
        // }
    },[fromToken,toToken,tokenInAmount,refresh])

    const refreshRouting = () => {
        setRefresh(true);
    }

    const changeTokenInAmount = async(value) => {
        if(isTokenInAmountDisabled) {
            await setTokenInAmount(undefined)
        } else {
            await setTokenInAmount(value);
        }
        console.log("tokenInAmount", tokenInAmount);
    }

    const token_img = {'FINIX':FINIX, 'KBNB':KBNB, 'KDAI':KDAI, 'KETH':KETH, 'KLAY':KLAY, 'KORC':KORC, 'KSP':KSP, 'KUSDT':KUSDT, 'KWBTC':KWBTC, 'KXRP':KXRP, 'SIX':SIX};

    return(
        <Box style = {{ color: "#3A2A17", padding: "30px 30px", fontSize: "15px", backgroundColor: "#FFFDD0" }}>
            <div> Kaikas wallet is connected </div>
            <p style = {{fontSize: "20px", textAlign: "left"}}>
                Swap
            </p>

            <div>
                {(isSwapSuccess===undefined) ?
                    <div></div>
                    :
                    <div>
                    {(isSwapSuccess===true) ?
                        <SwapSuccess setIsSwapSuccess={setIsSwapSuccess}/>
                    :
                        <SwapError setIsSwapSuccess={setIsSwapSuccess}/>
                    }
                    </div>
                }
            </div>

            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10, marginLeft: 30, marginRight: 30, marginTop: 30, width: 300}}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    From
                </p>
                <div style={{display: "flex", "justify-content": "center"}}>
                    {/*<BigNumberInput*/}
                    {/*    decimals={fromToken.decimals} onChange={changeTokenInAmount}*/}
                    {/*    value={tokenInAmount} renderInput={props => <Input {...props} />}*/}
                    {/*    style = {{ color: "#3A2A17", padding: "15px 20px", fontSize: "15px" }}*/}
                    {/*/>*/}
                    <TextField style = {{ color: "#3A2A17", padding: "10px 10px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10}}
                        type="number" format="none" value={tokenInAmount} onChange ={(e)=>changeTokenInAmount(e.target.value)}
                        disabled = {isTokenInAmountDisabled}
                    />
                    <div>
                        {(fromToken.id==='Dummy') ?
                            <div></div>
                        :
                            <div style={{ display: "flex", alignContent:"center"}}>
                                <img src={token_img[fromToken.label]} style={{alignSelf: "center", marginRight: 5}} width="30"/>
                                <p style={{alignSelf: "center"}}> {fromToken.label} </p>
                            </div>
                        }
                    </div>
                </div>
                <SelectToken setFromOrToToken={setFromToken}/>
            </Box>
            <ArrowDownwardIcon style = {{color: "#3A2A17", marginTop: "10px", marginBottom: "10px"}} />
            <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10, marginLeft: 30, marginRight: 30, width: 300 }}>
                <p style = {{fontSize: "15px", textAlign: "left"}}>
                    To (estimated)
                </p>
                <div style={{display: "flex", "justify-content": "center"}}>
                    <TextField style = {{ color: "#3A2A17", padding: "10px 10px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10}}
                               type="number" format="none" value={tokenOutAmount} inputProps={{ readOnly: true }}  disabled={true} />
                    <div>
                        {(toToken.id==='Dummy') ?
                            <div></div>
                        :
                            <div style={{ display: "flex", alignContent:"center"}}>
                                <img src={token_img[toToken.label]} style={{alignSelf: "center", marginRight: 5}} width="30"/>
                                <p style={{alignSelf: "center"}}> {toToken.label} </p>
                            </div>
                        }
                    </div>
                </div>
                <SelectToken setFromOrToToken={setToToken}/>
            </Box>
            <SwapButton tokenInLabel={fromToken.label} tokenOutLabel={toToken.label} tokenInAmount={tokenInAmount} setIsSwapSuccess={setIsSwapSuccess}/>
            {/*<SwapButtonTest/>*/}
            <div>
                {(routing.length === 0) ?
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