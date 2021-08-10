import React, {useEffect, useState} from "react";
import './App.css';
import {Input, Box} from "@material-ui/core";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {BigNumberInput} from "big-number-input";
import Caver from "caver-js";

import {InstallKaikas} from "./components/InstallKaikas.js";
import {ConnectKaikas} from "./components/ConnectKaikas.js";
import {Swap} from "./components/Swap.js";
import {SelectToken} from "./components/SelectToken.js";
import {myWalletAddress, password, keystorepath} from "./personal.js";

function App() {

  const tokenList = require("./tokenList.json");

  const [isKaikasInstalled, setIsKaikasInstalled] = useState(true);
  const [isKaikasConnected, setIsKaikasConnected] = useState(true);
  const [myWalletAddress, setMyWalletAddress] = useState();
  const [tokenInAmount, setTokenInAmount] = useState();
  const [fromToken, setFromToken] = useState(tokenList[0]);
  const [toToken, setToToken] = useState(tokenList[0]);

  console.log("myWalletAddress",myWalletAddress);
  console.log("fromToken:", fromToken.label, "toToken: ", toToken.label)

  const klaytn = window.klaytn;
  console.log("klaytn",klaytn);
  const caver = new Caver(klaytn);
// const caver = new Caver(window['klaytn']);

//priavteKey 가져오는거 실패
// let privateKey;
// klaytn.sendAsync({
//   method: 'klay_getAccountKey',
//   params: ["0x3A7d1D4Ec33faA64827CA8f4f17F747834121004","latest"],
//   from: "0x3A7d1D4Ec33faA64827CA8f4f17F747834121004"
// }, (result) => {
//   console.log("result", privateKey)
//   // privateKey = result.result.key.x;
// })
// console.log("privateKey", privateKey);

  const keystore = require('./keystore.json');
  const keyring = caver.wallet.keyring.decrypt(keystore,password);
//add keyring to wallet
  caver.wallet.add(keyring);

//klaytn.sendAsync({method: 'klay_sendTransaction' ... 을 통해 transaction 보내야할듯

  const getNetwork = async() => {
    const network = await klaytn.networkVersion
    if (network===8217){
      // console.log("cypress main network")
    } else if (network===1001){
      // console.log("baobab test network")
    }
  }
  getNetwork()

  const getAccount = async() => {
    let account;
    account = await klaytn.selectedAddress
    // console.log("account in getAccount()", account)
    // klaytn.on('accountsChanged', (accounts) => {
    //     account = accounts[0];
    //     console.log("user changed her account to ", account)
    // })
    setMyWalletAddress(account);
    return account;
  }
  getAccount()

  useEffect(()=>{
    const checkIsKaikasInstalled = async() => {
      if (klaytn.isKaikas){
        console.log("Kaikas is installed")
        setIsKaikasInstalled(true);
      } else {
        console.log("Kaikas is NOT installed")
        setIsKaikasInstalled(false);
      }
      // 이게 위에 코드랑 뭐가 다른지 모르겠음
      // if (typeof(klaytn) === 'undefined'){
      //   console.log("user does not used kaikas")
      // return false;
      // } else {
      //   console.log("user uses kaikas")
      // return true;
      // }
    }
    checkIsKaikasInstalled();
  })

  useEffect(()=>{
    const checkIsKaikasConnected = async() => {
      // console.log("klaytn._kaikas.isEnabled()",klaytn._kaikas.isEnabled())
      if (klaytn._kaikas.isEnabled()){
        console.log("Kaikas is connected")
        setIsKaikasConnected(true);
      } else {
        console.log("Kaikas is NOT connected")
        setIsKaikasConnected(false);
      }
    }
    checkIsKaikasConnected();
  })

  const changeTokenInAmount = async(value) => {
    await setTokenInAmount(value);
    console.log("tokenInAmount",tokenInAmount);
  }

  return (
      <div className="App">
        <header className="App-header">

          {!isKaikasInstalled ?
              <InstallKaikas/>
              :
              <div>
                {!isKaikasConnected ?
                    <ConnectKaikas klaytn={klaytn} setMyWalletAddress={setMyWalletAddress}/>
                    :
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
                      <Swap caver={caver} myWalletAddress={myWalletAddress} tokenInAddress={fromToken.address}
                      tokenOutAddress={toToken.address} tokenInAmount={tokenInAmount} slippage={5}/>
                    </Box>
                }
              </div>

          }
        </header>
      </div>
  );
}

export default App;