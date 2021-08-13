const CaverExtKAS = require('caver-js-ext-kas');
const caver = new CaverExtKAS();
const type = require('../Algorithm/type_v3.js');
//메인넷은 8217, 테스트넷은 1001
//KAS console을 사용하기위한 access key 입니다. => 트랜잭션 보내는게 무료(하루에 10000번까지)
// set1: 
// const ACCESS_KEY = "KASKQO63SLJW75Q0FJB61B4N";
// const PRIVATE_KEY = "QAXbYjYlXCf5BAgax7Dm-C0j-kk8RRcW0yfJYNcH";
// set2: 
// const ACCESS_KEY = "KASKLGJKFXREP8VVYXPF74NQ";
// const PRIVATE_KEY = "YWaTxezIPC4bEJm5cwvsO8Ov7E5jNDjQyXyT10Lk";
// set3 (100000 request) :
// const ACCESS_KEY = "KASKKQ0N5AU2XFFXM5YDNXTG";
// const PRIVATE_KEY = "_0_9w7fFYdS3uvIq2Kf_PsNcjrzxsPdOHkrQNj7M";

// // // set4: 
// const ACCESS_KEY = "KASK79FDZ8BNOJVC8Q2GEJGJ";
// const PRIVATE_KEY = "PIQYzIv5rSvo1rsy7jCM6CKx7roJixGoBxkIvBrm";
// set5:
const ACCESS_KEY = "KASKBDIFAXVXK14IEVRJDFVS";
const PRIVATE_KEY = "xW5VfL4rS6lOuEENPBs5jt0UeVDYMxgRIA14EAoS";

caver.initKASAPI(8217, ACCESS_KEY, PRIVATE_KEY);

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider());//'http://localhost:8551'

const KSLP_ADDRESS = {

  KORC_KUSDT_ADDRESS: "0x94f390a8438b5de00b868d3ae47863db90fb92c3",
  KLAY_KUSDT_ADDRESS: "0xd83f1b074d81869eff2c46c530d7308ffec18036",
  KLAY_KDAI_ADDRESS: '0xa3987cf6C14F1992e8b4a9E23192Eb79dC2969b8',
  KLAY_KXRP_ADDRESS: "0x86e614ef51b305c36a0608baa57fcaaa45844d87",
  KLAY_KETH_ADDRESS: "0x27f80731dddb90c51cd934e9bd54bff2d4e99e8a",
  KLAY_KSP_ADDRESS: "0x34cf46c21539e03deb26e4fa406618650766f3b9",
  KLAY_SIX_ADDRESS: "0x64b4ee8a878d785c9c06a18966d51a33345e5610",
  KLAY_KORC_ADDRESS: "0xe9ddb7a6994bd9cdf97cf11774a72894597d878b",
  KLAY_KBNB_ADDRESS: "0xe20b9aeacac615da0fdbeb05d4f75e16fa1f6b95",
  KETH_KUSDT_ADDRESS: "0x029e2a1b2bb91b66bd25027e1c211e5628dbcb93",
  KUSDT_KDAI_ADDRESS: "0xc320066b25b731a11767834839fe57f9b2186f84",
  KWBTC_KUSDT_ADDRESS: "0x9103beb39283da9c49b020d6546fd7c39f9bbc5b",
  KSP_KUSDT_ADDRESS: "0xe75a6a3a800a2c5123e67e3bde911ba761fe0705",
  KLAY_KBELT_ADDRESS: "0x157c39202fae6233fec3f8b3bcb2158200d0a863",
  KSP_KBNB_ADDRESS: "0x7328b85eff28c3068f69fe662632d37d48ba227f",
  KETH_KBNB_ADDRESS: "0x8119f0CeC72a26fE23CA1aB076137Ea5D8a19d54",
  // KLAY_AGOV_ADDRESS: "0x5c6795e72c47d7fa2b0c7a6446d671aa2e381d1e",

  KSP_KWBTC_ADDRESS: '0x85Fae50259EbB9a86F49BDBfb8dBaEC84a7ED5fe',
  // KLAY_CLBK_ADDRESS: "0x55a5dcc23a7a697052ab5d881530849ca0efad34",
  // AGOV_HINT_ADDRESS: "0x194896a1fbd33a13d71e0a2053d4f8129f435e31",
  KORC_KXRP_ADDRESS: "0x805cb5eb7063f132ceaf56b2c7182c897a024a83",
  // KLAY_ABL_ADDRESS: "0x9609861eec1dc15756fd0f5429fb96e475790920",
  // KLAY_HIBS_ADDRESS: "0x6bf915f013dc12274adf57e3c68fe8464ddc8b10",
  KSP_KETH_ADDRESS: "0xa8f8f1153523eaedce48cec2ddbe1bcd483d0cd8",
  // KLAY_KHANDY_ADDRESS: "0xce28f9330658b6b4871c081e0a9a332ae8a7d8c1",
  // KLAY_BBC_ADDRESS: "0x9d9de38c473d769d76034200f122995d8b6550ea",
  KETH_KXRP_ADDRESS: "0x85ef87815bd7be28bee038ff201db78c7e0ed2b9",
  KSP_KORC_ADDRESS: "0x6dc6bd65638b18057f7e6a2e8f136f3e77cc2038",
  // KLAY_REDi_ADDRESS: "0x5e9bc710d817affa64e0fd93f3f7602e9f4dd396",
  // KLAY_MNR_ADDRESS: "0xe641811d4a0c80d1260d4036df54d90559b9ab54",
  KORC_KDAI_ADDRESS: "0x587a01f81e5c078cd7c03f09f45705530ffb7b94",
  KSP_KDAI_ADDRESS: "0x64e58f35e9d4e2ab6380908905177ce150aa8608",
  // KLAY_KDUCATO_ADDRESS: "0xfc4da06cf1d201b6cb9d99265614dac4937ad6a2",
  // KLAY_SSX_ADDRESS: "0x01d71c376425b4feccb7b8719a760110091b3eb9",
  // KLAY_TEMCO_ADDRESS: "0x2160db36b43cd6e2b71550d59f23d530f0578386",
  // ABL_KORC_ADDRESS: "0xa2867c345f9b7250fe6be6cccb6360dff9f6e38c",
  // KLAY_BEE_ADDRESS: "0x1453b3cbe0167dfac91204eb26822fc12208f516",
  // KLAY_WEMIX_ADDRESS: "0x917eed7ae9e7d3b0d875dd393af93fff3fc301f8",
  // KLAY_TRCL_ADDRESS: "0x8e4e386950f6c03b25d0f9aa8bd89c1b159e8aee",
  KSP_KXRP_ADDRESS: "0xa06b9a38a7b4b91cb5d9b24538296bfb3b97fbf3",
  // KLAY_WIKEN_ADDRESS: "0x6119b1540aa3bea20518f5e239f64d98ebe9aaff",
  // KLAY_SKLAY_ADDRESS: "0x073fde66b725d0ef5b54059aca22bbfc63a929ce",
  // KLAY_ISR_ADDRESS: "0x869440673a24e3c3f18c173d8a964b2f2621245b",
  // KLAY_KTRIX_ADDRESS: "0x0b8f6200597a3b75f4d1bf0668b8ecba2dc77afb",
  // KLAY_PIB_ADDRESS: "0x2ecdf3088488a8e91c332b9ee86bb87d4e9cce82",
  KXRP_KDAI_ADDRESS: "0x4b50d0e4f29bf5b39a6234b11753fdb3b28e76fc",
  KETH_KWBTC_ADDRESS: "0x2a6a4b0c96ca98eb691a5ddcee3c7b7788c1a8e3",
  // KSP_sKAI_ADDRESS: "0x6456acb56f9eeedb976d5d72b60fb31720155b75",
  // KLAY_sKAI_ADDRESS: "0x0734f80fbc2051e98e6c7cb37e08e067a9630c06",
  // KBELT_KORC_ADDRESS: "0x0f14648ed03a4172a0d186da51b66e7e9af6af66"
  // KUSDT_KAI_ADDRESS: "0x5787492d753d5f59365e2f98e2f18c3ae3bad6e7",
  // KLAY_KSTPL_ADDRESS: "0xfc61fbb57dd00765838a914e7d72a9eceb23ad80",
  // KLAY_KRAI_ADDRESS: "0xc19fe316a03f6bcc48498b67342b29d146fed349",
  // KLAY_KTON_ADDRESS: "0xd30339c1edb95e69e3b5b98f230d97b12f01d844",
  // KLAY_TURK_ADDRESS: "0x146117810f9ddd58741cca86a57006a65032c33f",
  // KLAY_KRUSH_ADDRESS: "0xdd79b37b8b90f7ce6c762120d74d5c9b85388629",
  // KLAY_KAUTO_ADDRESS: "0x11dd0daf4c80402ad61ea4f6b37ab60544188938",
  // KLAY_KQBZ_ADDRESS: "0x97575d656ec4122d022014d8dfd1ebe189e1ec69",
  // KLAY_BUZ_ADDRESS: "0x58fcf8638e8bfa38239d293960923ec7377aab40",
  // ABL_KORC_ADDRESS: "0xa2867c345f9b7250fe6be6cccb6360dff9f6e38c"
};
const DEFINIXLP_ADDRESS = {
  FINIX_KLAY_ADDRESS: "0x8fD25bb623a988E52c65f68A68E8780014F0892d",
  FINIX_KUSDT_ADDRESS: "0x3737811657E9d3E9638144411307838cBcE13775",
  KLAY_KETH_ADDRESS: "0xF33DB5D2E5d5d628462f6eaCA906DdCd16073e69",
  KLAY_KWBTC_ADDRESS: "0x84CD5b54dAa59E7Ae5a9d45f630ce690292FC4c1",
  KLAY_KXRP_ADDRESS: "0xd16B4B651c8A6A58086A1449eF852Fdf38922047",

  FINIX_SIX_ADDRESS: "0x36C53ecBD87d105E8d2D71984cE4eB4f3f341402",
  FINIX_KSP_ADDRESS: "0x0754Be11a1a1a58358B70441142643981e47d796",
  SIX_KUSDT_ADDRESS: "0x7433d3F86D9aE8D8989bAc87C2a1c06d29121D35",
  SIX_KLAY_ADDRESS: "0x92f204c1d9D31A70e40A50D744fF0aA3b2600FD9",

  KETH_KUSDT_ADDRESS: "0x925bB55693857F33fE2df12E7DB6cFe63C308533",
  KWBTC_KUSDT_ADDRESS: "0xd7e66f34d76779396Ed62e0F097Be4a82D2F4B57",
  KLAY_KUSDT_ADDRESS: "0xcCCd396490e84823Ad17ab9781476a17150AD8e2",

  KDAI_KUSDT_ADDRESS: "0x12Fd4576aBC462A1FBbD933a7af3D4895517BAF2",
  KBNB_KUSDT_ADDRESS: "0x10592D608Aeb69DEd0C792127526e25D2b171185",
  KXRP_KUSDT_ADDRESS: "0x4CAC28FBCE94A011c6eDDEd62aA91CDa4eb2BC3F",
  KBNB_FINIX_ADDRESS: "0x85234cf8FAc4D5e03a553d766C64901b811A31e4"
};
const TOKEN_ADDRESS = {
  KLAY: "0x5819b6af194a78511c79c85ea68d2377a7e9335f",
  KSP: "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654",
  KWBTC: "0x16d0e1fbd024c600ca0380a4c5d57ee7a2ecbf9c",
  KORC: "0xfe41102f325deaa9f303fdd9484eb5911a7ba557",
  KUSDT: "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167",
  KETH: "0x34d21b1e550d73cee41151c77f3c73359527a396",
  KXRP: "0x9eaefb09fe4aabfbe6b1ca316a3c36afc83a393f",
  // KAUTO: "0x8583063110b5d29036eced4db1cc147e78a86a77",
  // KTRIX: "0x0c1d7ce4982fd63b1bc77044be1da05c995e4463",
  // KBELT: "0xdfe180e288158231ffa5faf183eca3301344a51f",
  KBNB: "0x574e9c26bda8b95d7329505b4657103710eb32ea",
  // KXVS: "0x735106530578fb0227422de25bb32c9adfb5ea2e",
  KDAI: "0x5c74070fdea071359b86082bd9f9b3deaafbe32b",
  // CLBK: "0xc4407f7dc4b37275c9ce0f839652b393e13ff3d1",
  AGOV: "0x588c62ed9aa7367d7cd9c2a9aaac77e44fe8221b",
  // HINT: "0x4dd402a7d54eaa8147cb6ff252afe5be742bdf40",
  // ABL: "0x46f307b58bf05ff089ba23799fae0e518557f87c",
  // HIBS: "0xe06b40df899b9717b4e6b50711e1dc72d08184cf",
  // KHANDY: "0x3f34671fba493ab39fbf4ecac2943ee62b654a88",
  // BBC: "0x321bc0b63efb1e4af08ec6d20c85d5e94ddaaa18",
  // REDi: "0x1cd3828a2b62648dbe98d6f5748a6b1df08ac7bb",
  // MNR: "0x27dcd181459bcddc63c37bab1e404a313c0dfd79",
  // KDUCATO: "0x91e0d7b228a33072d9b3209cf507f78a4bd835f2",
  // SSX: "0xdcd62c57182e780e23d2313c4782709da85b9d6c",
  // TEMCO: "0x3b3b30a76d169f72a0a38ae01b0d6e0fbee3cc2e",
  // BEE: "0x75ad14d0360408dc6f8163e5dfb51aad516f4afd",
  // WEMIX: "0x5096db80b21ef45230c9e423c373f1fc9c0198dd",
  // TRCL: "0x4b91c67a89d4c4b2a4ed9fcde6130d7495330972",
  // WIKEN: "0x275f942985503d8ce9558f8377cc526a3aba3566",
  // SKLAY: "0xa323d7386b671e8799dca3582d6658fdcdcd940a",
  // ISR: "0x9657fb399847d85a9c1a234ece9ca09d5c00f466",
  // PIB: "0xafde910130c335fa5bd5fe991053e3e0a49dce7b",
  // sKAI: "0x37d46c6813b121d6a27ed263aef782081ae95434",
  // KSTPL: "0x49a767b188b9d782d7b0efcd485ca3796390198e",
  // KRAI: "0xb40178be0fcf89d0051682e5512a8bab56b9ec3e",
  SIX: "0xef82b1c6a550e730d8283e1edd4977cd01faf435",
  // KTON: "0x100bc15ae8b489c771d9740ea0bb1aea945a1f67",
  // TURK: "0x8c783809332be7734fa782eb5139861721f77b33",
  // KRUSH: "0x2fade69ba4dcb112c530c48fdf41fc071685cede",
  // KQBZ: "0x507efa4e365fd5def42cb05ae3ecb51a30321588",
  // BUZ: "0x75ad14d0360408dc6f8163e5dfb51aad516f4afd",
  // KAI: "0xe950bdcfa4d1e45472e76cf967db93dbfc51ba3e",
  FINIX: "0xd51c337147c8033a43f3b5ce0023382320c113aa"
};
const TOKEN_DECIMAL = {
  KLAY: "18",
  KSP: "18",
  KORC: "18",
  KUSDT: "6",
  KETH: "18",
  KXRP: "6",
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
  KWBTC: "8",
  HINT: "18",
  KAI: "18",
  FINIX: "18"
};
async function getCurrentPool(contract_address) {
  try{
    var A = await caver.kas.wallet.callContract(contract_address, 'getCurrentPool');//tokenA와 tokenB의 balance가 연달아 담겨져 옵니다.
    return A;
  } catch(error){
    console.log(error);
  }
};

async function test() {
  for (let contract_name in KSLP_ADDRESS) {
    var getCurrentPool_res;
    try{
      getCurrentPool_res = await getCurrentPool(KSLP_ADDRESS[contract_name]);      
    }
    catch(err){
      console.log(err);
    }
    let tokenA_hex = (getCurrentPool_res.result).substring(0, 66);
    let tokenB_hex = (getCurrentPool_res.result).substring(66, 132);
    let tokenA_decimal = web3.eth.abi.decodeParameter("uint256", tokenA_hex);
    let tokenB_decimal = web3.eth.abi.decodeParameter("uint256", "0x" + tokenB_hex);

    let [tokenAName, tokenBName] = contract_name.split("_");

    tokenA_decimal = tokenA_decimal / Math.pow(10, Number(TOKEN_DECIMAL[tokenAName]));
    tokenB_decimal = tokenB_decimal / Math.pow(10, Number(TOKEN_DECIMAL[tokenBName]));

    var i = type.index_finder(tokenAName);
    var j = type.index_finder(tokenBName);
    if(i < type.MATRIX_SIZE && j < type.MATRIX_SIZE){
        type.SwapMatrix[i][j].add_ele('KLAYSWAP', tokenA_decimal, tokenB_decimal);
        type.SwapMatrix[j][i].add_ele('KLAYSWAP', tokenB_decimal, tokenA_decimal);
    }
  }
  
  for (let contract_name in DEFINIXLP_ADDRESS) {

    let [tokenAName, tokenBName] = contract_name.split("_");
    var tokenA_hex, tokenB_hex;
    try{
      tokenA_hex = await caver.kas.wallet.callContract(TOKEN_ADDRESS[tokenAName], 'balanceOf', [{ type: 'address', value: DEFINIXLP_ADDRESS[contract_name] }]);
      tokenB_hex = await caver.kas.wallet.callContract(TOKEN_ADDRESS[tokenBName], 'balanceOf', [{ type: 'address', value: DEFINIXLP_ADDRESS[contract_name] }]);
    }
    catch(err){
      console.log(err);
    }
    let tokenA_decimal = web3.eth.abi.decodeParameter("uint256", tokenA_hex.result);
    let tokenB_decimal = web3.eth.abi.decodeParameter("uint256", tokenB_hex.result);

    tokenA_decimal = tokenA_decimal / Math.pow(10, Number(TOKEN_DECIMAL[tokenAName]));
    tokenB_decimal = tokenB_decimal / Math.pow(10, Number(TOKEN_DECIMAL[tokenBName]));

    var i = type.index_finder(tokenAName);
    var j = type.index_finder(tokenBName);
    if(i < type.MATRIX_SIZE && j < type.MATRIX_SIZE){
        type.SwapMatrix[i][j].add_ele('DEFINIX', tokenA_decimal, tokenB_decimal);
        type.SwapMatrix[j][i].add_ele('DEFINIX', tokenB_decimal, tokenA_decimal);
    }
  }
}

module.exports = {
  test,
  TOKEN_ADDRESS,
  TOKEN_DECIMAL
};