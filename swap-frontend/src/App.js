import React, {useEffect,useState} from "react";
import PropTypes from 'prop-types';
import './App.css';
import {Button, Input, Box, TextField, MenuItem, Dialog, DialogTitle, List, ListItem, ListItemText} from "@material-ui/core";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import {BigNumberInput} from "big-number-input";
import Caver from "caver-js";

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
//   console.log(result,"result")
//   privateKey = result.result.key.x;
// })
// console.log(privateKey);

const keystore = require('./keystore.json')
const keyring = caver.wallet.keyring.decrypt(keystore, '');
//add keyring to wallet
caver.wallet.add(keyring)

//klaytn.sendAsync({method: 'klay_sendTransaction' ... 을 통해 transaction 보내야할듯

const isKaikasInstalled = async() => {
  if (klaytn.isKaikas){
    console.log("Kaikas is installed")
    return true;
  } else {
    console.log("Kaikas is NOT installed")
    return false;
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

// 원하는대로 실행 안됨
const isKaikasConnected = async() => {
  // console.log("klaytn._kaikas.isEnabled()",klaytn._kaikas.isEnabled())
  if (klaytn._kaikas.isEnabled()){
    console.log("Kaikas is connected")
    return true;
  } else {
    console.log("Kaikas is NOT connected")
    return false;
  }
}

const connectWallet = async() => {
  console.log("connectWallet is clicked")
  // if("clickButton"){
    try {
      const accounts = await klaytn.enable();
      const account = accounts[0];
      console.log("account", account)
      getNetwork();
      getAccount();
    } catch (error) {
      console.log(error)
    }
  // }
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
  console.log("account in getAccount", account)
  console.log(account)
  klaytn.on('accountsChanged', (accounts) => {
    account = accounts[0];
    console.log("user changed her account to ", account)
  })
  return account;
}

//kusdt
const tokenInAddress = "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167"
const tokenInDecimal = 6
//kdai
const tokenOutAddress = "0x5c74070fdea071359b86082bd9f9b3deaafbe32b"
const tokenOutDecimal = 18

const tokenList = require("./tokenList.json");
console.log("tokenList",tokenList)


//
// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);
//
//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//
//   const handleClose = (value) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };
//
//   return (
//       <div>
//         <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
//         <br />
//         <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//           Open simple dialog
//         </Button>
//         <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
//       </div>
//   );
// }


function App() {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tokenInAmount, setTokenInAmount] = useState();
  const [fromToken, setFromToken] = useState(tokenList[0]);
  const [toToken, setToToken] = useState();

  function TokenListDialog(props) {
    const { onClose, selectedToken, open } = props;

    const handleClose = () => {
      onClose(selectedToken);
    };

    const handleListItemClick = (token) => {
      onClose(token);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle id="simple-dialog-title">Select Token</DialogTitle>
          <List>
            {tokenList.map((token) => (
                <ListItem button onClick={() => handleListItemClick(token)} key={token.id}>
                  <ListItemText primary={token.label} />
                </ListItem>
            ))}
          </List>
        </Dialog>
    );
  }

  TokenListDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedToken: PropTypes.object.isRequired,
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (fromToken) => {
    setDialogOpen(false);
    setFromToken(fromToken);
  };

  const changeTokenInAmount = async(value) => {
    console.log("value",value)
    await setTokenInAmount(value);
    console.log("tokenInAmount",tokenInAmount);
  }

  const changeFromToken = async(id) => {
    console.log("From id", id)
    const selectedFromToken = await tokenList.find((t) => t.id ===id);
    console.log("selectedFromToken",selectedFromToken)
    await setFromToken(selectedFromToken);

    // await localStorage.setItem('selectedFromToken', selectedFromToken.id);
  }

  const changeToToken = async(id) => {
    console.log("To id", id)
    const selectedToToken = await tokenList.find((t) => t.id ===id);
    console.log("selectedToToken",selectedToToken)
    await setToToken(selectedToToken);

    // await localStorage.setItem('selectedToToken', selectedToToken.id);
  }

  const swap = async() => {
    const myWalletAddress = "0x3A7d1D4Ec33faA64827CA8f4f17F747834121004";
    const DfxRouterAddress = "0x4E61743278Ed45975e3038BEDcaA537816b66b5B";
    const RouterAbi = require('./DfxRouterAbi.json');
    const DfxRouter = new caver.contract(RouterAbi, DfxRouterAddress, {transactionConfirmationBlocks: 1});

    //slippage in percentage
    const slippage = 5;

    const Kip7Abi = require("./Kip7Abi.json");
    const Kip7 = new caver.contract(Kip7Abi, tokenInAddress);

    let amountOutMin;
    let getAmountOutMin = async() => {
      const amountIn = caver.utils.toBN(tokenInAmount)
      console.log("amountIn", amountIn.toString())
      const amounts = await DfxRouter.methods.getAmountsOut(amountIn, [tokenInAddress, tokenOutAddress]).call();
      const amountOut = caver.utils.toBN(amounts[1]);
      console.log("amountOut", amountOut.toString())

      //consider slippage
      const slippageMultiplier = caver.utils.toBN((100-slippage).toString());
      console.log("slippageMultiplier",slippageMultiplier.toString())
      const slippageDivider = caver.utils.toBN((100).toString());
      console.log("slippageDivider",slippageDivider.toString())
      amountOutMin = amountOut.mul(slippageMultiplier).div(slippageDivider);
      console.log("amountOutMin",amountOutMin.toString(), caver.utils.isBN(amountOutMin));
    }

    let approveRouter = async() => {
      let currentAllowance = await Kip7.methods.allowance(myWalletAddress,DfxRouterAddress).call();
      // 0 current allowance means token has not been approved yet
      if (currentAllowance===0){
        console.log("not approved yet")
        // approve router to transact the kip-7 token and set allowance to maximum uint256
        let allowance = caver.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
        await Kip7.methods.approve(DfxRouterAddress, allowance).send({from: myWalletAddress, gas: 1000000 });
      } else {
        console.log("already approved")
      }

    }

    let executeSwap = async() => {
      const amountIn = caver.utils.toBN(tokenInAmount)
      let tx = await DfxRouter.methods.swapExactTokensForTokens(
          amountIn, amountOutMin, [tokenInAddress,tokenOutAddress], myWalletAddress, Date.now() + 1000 * 60 * 5)
          .send({ from: myWalletAddress, gas: 1000000 });
      console.log(tx);
    }

    let start = async() => {
      await getAmountOutMin();
      await approveRouter();
      await executeSwap();
    }

    start();
  }

  return (
    <div className="App">
      <header className="App-header">

        {!isKaikasInstalled() ?
            <Box style = {{ color: "#3A2A17", padding: "30px 30px", fontSize: "15px", backgroundColor: "#FFFDD0" }}>
              <div>
                <p> Haven't installed Kaikas wallet yet? </p>
                <p> Install Kaikas first to use Navi. </p>
              </div>
            </Box>
            :
              <div>
                {!isKaikasConnected() ?
                  <Button onClick = {()=>connectWallet()}
                  style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", fontSize: "15px", textTransform: 'none'}}>
                  Connect your Kaikas wallet
                  </Button>
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
                          decimals={tokenInDecimal} onChange={changeTokenInAmount}
                          value={tokenInAmount} renderInput={props => <Input {...props} />}
                          style = {{ color: "#3A2A17", padding: "15px 20px", fontSize: "15px" }}
                      />
                      <Button onClick = {()=>handleDialogOpen()}
                              style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", padding: "15px 20px", fontSize: "15px", textTransform: 'none', marginLeft: "10px"}}>
                        Select Token ∨
                      </Button>
                      <TokenListDialog selectedToken={fromToken} open={dialogOpen} onClose={handleDialogClose} />
                    </Box>
                    <ArrowDownwardIcon style = {{color: "#3A2A17", marginTop: "10px", marginBottom: "10px"}} />
                    <Box style = {{ color: "#3A2A17", padding: "10px 30px", fontSize: "15px", backgroundColor: "#E8DED1", borderRadius: 10 }}>
                      <p style = {{fontSize: "15px", textAlign: "left"}}>
                        To
                      </p>
                    </Box>
                    {/*<TextField select id="select" value="Klay" label="From" onChange={changeFromToken}*/}
                    {/*style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", padding: "15px 20px", fontFamily: 'Mulish', fontSize: "10px", marginTop: "15px", marginLeft: "10px"}}>*/}
                    {/*  <MenuItem value="Klay" style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", fontFamily: 'Mulish', fontSize: "15px"}}> KLAY </MenuItem>*/}
                    {/*  <MenuItem value="Ksp" style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", fontFamily: 'Mulish', fontSize: "15px"}}> KSP </MenuItem>*/}
                    {/*</TextField>*/}

                    {/*<TextField select id="select" value="Ksp" label="To" onChange={changeToToken}*/}
                    {/*           style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", padding: "15px 20px", fontFamily: 'Mulish', fontSize: "10px", marginTop: "15px", marginLeft: "10px"}}>*/}
                    {/*  <MenuItem value="Klay" style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", fontFamily: 'Mulish', fontSize: "15px"}}> KLAY </MenuItem>*/}
                    {/*  <MenuItem value="Ksp" style = {{ color: "#3A2A17", backgroundColor: "#E8DED1", fontFamily: 'Mulish', fontSize: "15px"}}> KSP </MenuItem>*/}
                    {/*</TextField>*/}

                    {/*<p style = {{fontSize: "15px"}}>*/}
                    {/*  Enter amount of KLAY to swap to KSP*/}
                    {/*</p>*/}

                    {/*<BigNumberInput*/}
                    {/*decimals={tokenInDecimal} onChange={changeTokenInAmount}*/}
                    {/*value={tokenInAmount} renderInput={props => <Input {...props} />}*/}
                    {/*style = {{ color: "#3A2A17", padding: "15px 20px", fontSize: "15px" }}*/}
                    {/*/>*/}

                    <Button onClick = {()=>swap()}
                    style = {{ color: "#3A2A17", backgroundColor: "#CFB997", padding: "15px 20px", textTransform: 'none', fontSize: "15px", marginTop: "15px", marginLeft: "15px", marginRight: "15px", borderRadius: 10}}>
                    swap
                    </Button>
                  </Box>
                }
              </div>

        }
      </header>
    </div>
  );
}

export default App;

// "networks": {
//   "1576480295116": {
//     "events": {},
//     "links": {},
//     "address": "0x14A9bA087378B20deA5990a4fb5FA694f9DA27d9",
//         "transactionHash": "0xbf39197e83e7f8c473bc760464f83fc21b54ddb4a096681ef0bb93c03d0cfe83"
//   },
//   "1576481317749": {
//     "events": {},
//     "links": {},
//     "address": "0x14A9bA087378B20deA5990a4fb5FA694f9DA27d9",
//         "transactionHash": "0xbf39197e83e7f8c473bc760464f83fc21b54ddb4a096681ef0bb93c03d0cfe83"
//   }
// },