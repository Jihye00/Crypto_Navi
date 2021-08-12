import React, {useEffect, useState} from "react";
import './App.css';
import {klaytn, caver} from "./components/caver.js";

import {InstallKaikas} from "./components/InstallKaikas.js";
import {ConnectKaikas} from "./components/ConnectKaikas.js";
import {ConnectCypress} from "./components/ConnectCypress.js";
import {SwapBox} from "./components/SwapBox.js";
import {RefreshButton} from "./components/RefreshButton.js";

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
      }
    }
    checkIsKaikasInstalled();
    console.log("isKaikasInstalled", isKaikasInstalled)
  })

    useEffect(()=> {
        if(!klaytn){
            return;
        }
        const checkIsKaikasConnected = async () => {
            if (klaytn._kaikas.isEnabled()) {
                setIsKaikasConnected(true);
            } else {
                setIsKaikasConnected(false);
            }
        }
        checkIsKaikasConnected();
        console.log("isKaikasConnected", isKaikasConnected)
    })

    useEffect(()=> {
        if(!klaytn){
            return;
        }
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
    })

  return (
      <div className="App">
        <header className="App-header">
          {!isKaikasInstalled ?
              <div>
                  <InstallKaikas/>
                  <RefreshButton refreshFunction={undefined}/>
              </div>
              :
              <div>
                {!isKaikasConnected ?
                    <div>
                        <ConnectKaikas klaytn={klaytn} />
                        <br />
                        <RefreshButton refreshFunction={undefined}/>
                    </div>
                    :
                    <div>
                      {! isNetworkCypress ?
                          <div>
                              <ConnectCypress />
                              <br/>
                              <RefreshButton refreshFunction={undefined}/>
                          </div>
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