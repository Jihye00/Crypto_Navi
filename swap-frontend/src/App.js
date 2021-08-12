import React, {useEffect, useState} from "react";
import './App.css';
import {klaytn, caver} from "./components/caver.js";

import {InstallKaikas} from "./components/InstallKaikas.js";
import {ConnectKaikas} from "./components/ConnectKaikas.js";
import {ConnectCypress} from "./components/ConnectCypress.js";
import {SwapBox} from "./components/SwapBox.js";

function App() {

  const [isKaikasInstalled, setIsKaikasInstalled] = useState(false);
  const [isKaikasConnected, setIsKaikasConnected] = useState(false);
  const [isNetworkCypress, setIsNetworkCypress] = useState(false);

  //check if Kaikas is installed
  useEffect(()=> {
    const checkIsKaikasInstalled = async () => {
      if (klaytn === undefined) {
        setIsKaikasInstalled(false);
      } else {
        setIsKaikasInstalled(true);
          const checkIsKaikasConnected = async () => {
              if (klaytn._kaikas.isEnabled()) {
                  setIsKaikasConnected(true);
              } else {
                  setIsKaikasConnected(false);
              }
          }
          checkIsKaikasConnected();
          console.log("isKaikasConnected", isKaikasConnected)

          const checkIsNetworkCypress = async () => {
              const network = await klaytn.networkVersion
              if (network === 8217) {
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
          klaytn.enable();
      }
    }
    checkIsKaikasInstalled();
    console.log("isKaikasInstalled", isKaikasInstalled)
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