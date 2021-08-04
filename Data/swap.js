const fs = require('fs');
const BigNumber = require("bignumber.js");
const safeMath = require("safemath");
const Caver = require('caver-js');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
const abi = require('./FactoryImpl.json');
const abi_definix = require('./DefinixRouter.json');
const personal = require('./personal.js');

const password = personal.password;
// Password for kaikas wallet
const myWalletAddress = personal.myWalletAddress;
// kaikas wallet address
const keystorePath = personal.keystorePath;
// const keystorePath = "/Users/jomingyu/mound_dev/Crypto_NAVI/Data/kaikas-0x09e4fc443cb26749281c961b99f71a2c763d1bc2.json";
// kaikas keystore path
const TOKEN_ADDRESS = {
  KLAY: "0x0000000000000000000000000000000000000000",
  KSP: "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654",
  KWBTC: "0x16d0e1fbd024c600ca0380a4c5d57ee7a2ecbf9c",
  KORC: "0xfe41102f325deaa9f303fdd9484eb5911a7ba557",
  KUSDT: "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167",
  KETH: "0x34d21b1e550d73cee41151c77f3c73359527a396",
  KXRP: "0x9eaefb09fe4aabfbe6b1ca316a3c36afc83a393f",
  KAUTO: "0x8583063110b5d29036eced4db1cc147e78a86a77",
  KTRIX: "0x0c1d7ce4982fd63b1bc77044be1da05c995e4463",
  KBELT: "0xdfe180e288158231ffa5faf183eca3301344a51f",
  KBNB: "0x574e9c26bda8b95d7329505b4657103710eb32ea",
  KXVS: "0x735106530578fb0227422de25bb32c9adfb5ea2e",
  KDAI: "0x5c74070fdea071359b86082bd9f9b3deaafbe32b",
  CLBK: "0xc4407f7dc4b37275c9ce0f839652b393e13ff3d1",
  AGOV: "0x588c62ed9aa7367d7cd9c2a9aaac77e44fe8221b",
  HINT: "0x4dd402a7d54eaa8147cb6ff252afe5be742bdf40",
  ABL: "0x46f307b58bf05ff089ba23799fae0e518557f87c",
  HIBS: "0xe06b40df899b9717b4e6b50711e1dc72d08184cf",
  KHANDY: "0x3f34671fba493ab39fbf4ecac2943ee62b654a88",
  BBC: "0x321bc0b63efb1e4af08ec6d20c85d5e94ddaaa18",
  REDi: "0x1cd3828a2b62648dbe98d6f5748a6b1df08ac7bb",
  MNR: "0x27dcd181459bcddc63c37bab1e404a313c0dfd79",
  KDUCATO: "0x91e0d7b228a33072d9b3209cf507f78a4bd835f2",
  SSX: "0xdcd62c57182e780e23d2313c4782709da85b9d6c",
  TEMCO: "0x3b3b30a76d169f72a0a38ae01b0d6e0fbee3cc2e",
  BEE: "0x75ad14d0360408dc6f8163e5dfb51aad516f4afd",
  WEMIX: "0x5096db80b21ef45230c9e423c373f1fc9c0198dd",
  TRCL: "0x4b91c67a89d4c4b2a4ed9fcde6130d7495330972",
  WIKEN: "0x275f942985503d8ce9558f8377cc526a3aba3566",
  SKLAY: "0xa323d7386b671e8799dca3582d6658fdcdcd940a",
  ISR: "0x9657fb399847d85a9c1a234ece9ca09d5c00f466",
  PIB: "0xafde910130c335fa5bd5fe991053e3e0a49dce7b",
  sKAI: "0x37d46c6813b121d6a27ed263aef782081ae95434",
  KSTPL: "0x49a767b188b9d782d7b0efcd485ca3796390198e",
  KRAI: "0xb40178be0fcf89d0051682e5512a8bab56b9ec3e",
  SIX: "0xef82b1c6a550e730d8283e1edd4977cd01faf435",
  KTON: "0x100bc15ae8b489c771d9740ea0bb1aea945a1f67",
  TURK: "0x8c783809332be7734fa782eb5139861721f77b33",
  KRUSH: "0x2fade69ba4dcb112c530c48fdf41fc071685cede",
  KQBZ: "0x507efa4e365fd5def42cb05ae3ecb51a30321588",
  BUZ: "0x75ad14d0360408dc6f8163e5dfb51aad516f4afd",
  KAI: "0xe950bdcfa4d1e45472e76cf967db93dbfc51ba3e",
  FINIX: "0xd51c337147c8033a43f3b5ce0023382320c113aa",
  WKLAY: "0x5819b6af194a78511c79c85ea68d2377a7e9335f"
};
const TOKEN_DECIMAL = {
  KLAY: "18",
  KSP: "18",
  KORC: "18",
  KUSDT: "6",//
  KETH: "18",
  KXRP: "6",//
  KAUTO: "18",
  KTRIX: "18",
  KBELT: "18",
  KBNB: "18",
  KDAI: "18",
  CLBK: "18",
  AGOV: "18",
  ABL: "18",
  HIBS: "18",
  KHANDY: "18",
  BBC: "18",
  REDi: "18",
  MNR: "6",
  KDUCATO: "18",
  SSX: "18",
  TEMCO: "18",
  BEE: "18",
  WEMIX: "18",
  TRCL: "18",
  WIKEN: "18",
  SKLAY: "18",
  ISR: "18",
  PIB: "18",
  sKAI: "18",
  KSTPL: "18",
  KRAI: "18",
  SIX: "18",
  KTON: "18",
  TURK: "18",
  KRUSH: "18",
  KQBZ: "18",
  BUZ: "18",
  //////////////
  KWBTC: "8",//
  HINT: "18",
  KAI: "18",
  FINIX: "18"
};

const Kip7Abi = require('./Kip7Abi.json');
const safemath = require('safemath');
//const Kip7 = new caver.contract(Kip7Abi, TOKEN_ADDRESS.SIX);// 수정

// let approveRouter = async () => {
//   // approve router to transact the kip-7 token, 최대 uint256으로 설정
//   let allowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
//   // currentAllowance가 0보다 커야지 approve가 되었다는 뜻
//   let currentAllowance = await Kip7.methods.allowance(myWalletAddress, DfxRouterAddress).call();
//   console.log("currentAllowance", currentAllowance);
//   await Kip7.methods.approve(DfxRouterAddress, allowance).send({ from: myWalletAddress, gas: 1000000 });
// }

async function approve(tokenname) {

  const Kip7 = new caver.contract(Kip7Abi, TOKEN_ADDRESS[tokenname]);// 수정
  let currentAllowance = await Kip7.methods.allowance(myWalletAddress, '0x4E61743278Ed45975e3038BEDcaA537816b66b5B').call();
  console.log("currentAllowance", currentAllowance);
  // 0 current allowance means token has not been approved yet
  if (currentAllowance == 0) {
    // approve router to transact the kip-7 token and set allowance to maximum uint256
    let allowance = new BigNumber("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    await Kip7.methods.approve('0x4E61743278Ed45975e3038BEDcaA537816b66b5B', allowance).send({ from: myWalletAddress, gas: 1000000 });
  }
};

// let amount = 0;
// let amount = BigInt( * Math.pow(10, TOKEN_DECIMAL[tokenAName]));
// let amount = safeMath.safeMule(163.71, 10 ** TOKEN_DECIMAL[tokenAName]);
const keystore = fs.readFileSync(keystorePath, 'utf8');
// const keystore = fs.readFileSync('./kaikas-0x09e4fc443cb26749281c961b99f71a2c763d1bc2.json', 'utf8');

// Decrypt keystore
const keyring = caver.wallet.keyring.decrypt(keystore, password);
//console.log(keyring);

caver.wallet.add(keyring);
async function swap(tokenAName, tokenBName, amount, dex) {
  // console.log(tokenAName, tokenBName, amount, dex);
  // amount = Number(1);
  // amount = BigInt(amount * Math.pow(10, TOKEN_DECIMAL[tokenAName]));
  // Read keystore json file
  // const keystore = fs.readFileSync('/Users/jomingyu/Desktop/untitled folder/kaikas-0x09e4fc443cb26749281c961b99f71a2c763d1bc2.json', 'utf8');
  // // const keystore = fs.readFileSync('./kaikas-0x09e4fc443cb26749281c961b99f71a2c763d1bc2.json', 'utf8');

  // // Decrypt keystore
  // const keyring = caver.wallet.keyring.decrypt(keystore, 'whalsrb0907@');
  // //console.log(keyring);

  // caver.wallet.add(keyring);
  const Factory = new caver.contract(abi.abi, '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654');
  const Router = new caver.contract(abi_definix, '0x4E61743278Ed45975e3038BEDcaA537816b66b5B');

  const empty = [];// 교환 라우팅이 현재 필요 없음
  // amount = Number(BigInt(amount) * BigInt(Math.pow(10, TOKEN_DECIMAL[tokenAName])));

  if (dex == "KLAYSWAP") {
    console.log("entered KLAYSWAP")
    if (tokenAName == 'KLAY') {
      // console.log("entered KLAYSWAP-KLAY")
      // // await approve(tokenAName);
      // amount = safemath.safeMule(amount, Math.pow(10, TOKEN_DECIMAL[tokenAName]));
      // amount = BigInt(amount) * BigInt(Math.pow(10, TOKEN_DECIMAL[tokenAName]));
      amount = Number((amount) * (Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      let res = await Factory.methods.exchangeKlayPos(TOKEN_ADDRESS[tokenBName], 1, empty).send({ from: myWalletAddress, gas: 1000000, value: "0x" + Number(amount).toString(16) });
      // console.log(res);
      return res.transactionHash;
    }
    else if (tokenAName != 'KLAY') {

      await approve(tokenAName);
      // amount = safemath.safeMule(amount, Math.pow(10, TOKEN_DECIMAL[tokenAName]));
      // amount = BigInt(amount * Math.pow(10, TOKEN_DECIMAL[tokenAName]));
      // amount = safemath.safeMule(BigInt(amount), BigInt(Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      amount = Number((amount) * (Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      let res = await Factory.methods.exchangeKctPos(TOKEN_ADDRESS[tokenAName], "0x" + Number(amount).toString(16), TOKEN_ADDRESS[tokenBName], 1, empty).send({ from: myWalletAddress, gas: 1000000 });
      // console.log(res);
      return res.transactionHash;
    }
    //let res = await Factory.methods.version().call();
    //console.log(res);
  }



  let path = [TOKEN_ADDRESS[tokenAName], TOKEN_ADDRESS[tokenBName]];
  if (dex == "DEFINIX") {
    console.log("entered DEFINIX")
    let timestamp = Date.now() + 1000 * 60 * 15;

    if (tokenAName == 'KLAY') {
      // amount = BigInt(amount * Math.pow(10, TOKEN_DECIMAL[tokenAName]));
      // amount = safemath.safeMule(BigInt(amount), BigInt(Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      amount = Number((amount) * BgInt(Math.pow(10, TOKEN_DECIMAL[tokenAName])));

      await approve("W"+tokenAName);
      //교환하는 토큰 중에 klay가 있다면 wklay로 주소를 바꾼다.
      path[0] = '0x5819b6af194a78511c79c85ea68d2377a7e9335f';
      let res = await Router.methods.swapExactETHForTokens(1, path, myWalletAddress, timestamp).send({ from: myWalletAddress, gas: 1000000, value: "0x" + Number(amount).toString(16) });
      // console.log(res);
      return res.transactionHash;

    }
    else if (tokenAName != 'KLAY' && tokenBName != 'KLAY') {
      // amount = safemath.safeMule(BigInt(amount), BigInt(Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      amount = Number((amount) * (Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      await approve(tokenAName);
      //교환되는 두 토큰으로 이루어진 pool이 존재해야함
      let res = await Router.methods.swapExactTokensForTokens("0x" + Number(amount).toString(16), 1, path, myWalletAddress, timestamp).send({ from: myWalletAddress, gas: 1000000 });
      // console.log(res);
      return res.transactionHash;

    }
    else if (tokenBName == 'KLAY') {
      amount = Number((amount) * (Math.pow(10, TOKEN_DECIMAL[tokenAName])));
      await approve(tokenAName);
      //교환하는 토큰 중에 klay가 있다면 wklay로 주소를 바꾼다.
      path[1] = '0x5819b6af194a78511c79c85ea68d2377a7e9335f';
      let res = await Router.methods.swapExactTokensForETH("0x" + Number(amount).toString(16), 1, path, myWalletAddress, timestamp).send({ from: myWalletAddress, gas: 1000000 });
      // console.log(res);
      return res.transactionHash;

    }
    //let res = await Router.methods.WETH().call();
    //console.log(res);
  }

};
// swap();

module.exports = {
  swap,
  TOKEN_DECIMAL
}
//1e18 peb : 1klay
