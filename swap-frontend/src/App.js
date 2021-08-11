import React, {useEffect, useState} from "react";
import './App.css';
import {klaytn, caver} from "./components/caver.js";

import {InstallKaikas} from "./components/InstallKaikas.js";
import {ConnectKaikas} from "./components/ConnectKaikas.js";
import {ConnectCypress} from "./components/ConnectCypress.js";
import {SwapBox} from "./components/SwapBox.js";

function App() {

  const [isKaikasInstalled, setIsKaikasInstalled] = useState(true);
  const [isKaikasConnected, setIsKaikasConnected] = useState(true);
  const [isNetworkCypress, setIsNetworkCypress] = useState(true);

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

  //check if Kaikas is installed
  useEffect(()=>{
    const checkIsKaikasInstalled = async() => {
      if (klaytn.isKaikas){
        setIsKaikasInstalled(true);
      } else {
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
    console.log("isKaikasInstalled", isKaikasInstalled)
  })

  useEffect(()=>{
    const checkIsKaikasConnected = async() => {
      // console.log("klaytn._kaikas.isEnabled()",klaytn._kaikas.isEnabled())
      if (klaytn._kaikas.isEnabled()){
        setIsKaikasConnected(true);
      } else {
        setIsKaikasConnected(false);
      }
    }
    checkIsKaikasConnected();
    console.log("isKaikasConnected", isKaikasConnected)
  })

  //check network
  useEffect(()=>{
    const checkIsNetworkCypress = async() => {
      const network = await klaytn.networkVersion
      if (network===8217){
        // console.log("cypress main network")
        setIsNetworkCypress(true);
      } else {
        setIsNetworkCypress(false);
      }
      // if (network===1001){
      // console.log("baobab test network") }
    }
    checkIsNetworkCypress()
    console.log("isNetworkCypress", isNetworkCypress)
  })

  return (
      <div className="App">
        <header className="App-header">
          {!isKaikasInstalled ?
              <InstallKaikas/>
              :
              <div>
                {!isKaikasConnected ?
                    <ConnectKaikas klaytn={klaytn} />
                    :
                    <div>
                      {! isNetworkCypress ?
                          <ConnectCypress />
                          :
                          <SwapBox/>
                      }
                    </div>
                }
              </div>
          }
        </header>
      </div>
  );
}

export default App;