const CaverExtKAS = require('caver-js-ext-kas');
const caver = new CaverExtKAS();
//메인넷은 8217, 테스트넷은 1001
//KAS console을 사용하기위한 access key 입니다. => 트랜잭션 보내는게 무료(하루에 10000번까지)
const ACCESS_KEY = "KASKQO63SLJW75Q0FJB61B4N";//"KASKBDIFAXVXK14IEVRJDFVS"; 
const PRIVATE_KEY = "QAXbYjYlXCf5BAgax7Dm-C0j-kk8RRcW0yfJYNcH";//"xW5VfL4rS6lOuEENPBs5jt0UeVDYMxgRIA14EAoS";  
caver.initKASAPI(8217, ACCESS_KEY, PRIVATE_KEY);

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider());//'http://localhost:8551'

//7월 31일 기준 클레이스왑의 모든 LP pool의 주소입니다.
const KSLP_ADDRESS = { 
  KLAY_KBNB_ADDRESS : "0xe20b9aeacac615da0fdbeb05d4f75e16fa1f6b95",
  KLAY_KUSDT_ADDRESS : "0xd83f1b074d81869eff2c46c530d7308ffec18036",
  KLAY_KDAI_ADDRESS : '0xa3987cf6C14F1992e8b4a9E23192Eb79dC2969b8', 
  KLAY_KXRP_ADDRESS : "0x86e614ef51b305c36a0608baa57fcaaa45844d87",
  KLAY_KETH_ADDRESS : "0x27f80731dddb90c51cd934e9bd54bff2d4e99e8a",
  KLAY_KSP_ADDRESS : "0x34cf46c21539e03deb26e4fa406618650766f3b9",
  KLAY_SIX_ADDRESS : "0x64b4ee8a878d785c9c06a18966d51a33345e5610",

  KETH_KBNB_ADDRESS : "0x8119f0CeC72a26fE23CA1aB076137Ea5D8a19d54",
  KSP_KBNB_ADDRESS : "0x7328b85eff28c3068f69fe662632d37d48ba227f",

  KORC_KUSDT_ADDRESS : "0x94f390a8438b5de00b868d3ae47863db90fb92c3",

  KSP_KWBTC_ADDRESS : '0x85Fae50259EbB9a86F49BDBfb8dBaEC84a7ED5fe',
  KETH_KUSDT_ADDRESS : "0x029e2a1b2bb91b66bd25027e1c211e5628dbcb93",
  // KLAY_CLBK_ADDRESS : "0x55a5dcc23a7a697052ab5d881530849ca0efad34",
  KUSDT_KDAI_ADDRESS : "0xc320066b25b731a11767834839fe57f9b2186f84",
  AGOV_HINT_ADDRESS : "0x194896a1fbd33a13d71e0a2053d4f8129f435e31",
  // KORC_KXRP_ADDRESS : "0x805cb5eb7063f132ceaf56b2c7182c897a024a83",
  // KLAY_ABL_ADDRESS : "0x9609861eec1dc15756fd0f5429fb96e475790920",
  // KLAY_HIBS_ADDRESS : "0x6bf915f013dc12274adf57e3c68fe8464ddc8b10",
  // KLAY_KBELT_ADDRESS : "0x157c39202fae6233fec3f8b3bcb2158200d0a863",
  KSP_KETH_ADDRESS : "0xa8f8f1153523eaedce48cec2ddbe1bcd483d0cd8",
  // KLAY_AGOV_ADDRESS : "0x5c6795e72c47d7fa2b0c7a6446d671aa2e381d1e",
  // KLAY_KHANDY_ADDRESS : "0xce28f9330658b6b4871c081e0a9a332ae8a7d8c1",
  // KLAY_BBC_ADDRESS : "0x9d9de38c473d769d76034200f122995d8b6550ea",
  KETH_KXRP_ADDRESS : "0x85ef87815bd7be28bee038ff201db78c7e0ed2b9",
  // KLAY_KORC_ADDRESS : "0xe9ddb7a6994bd9cdf97cf11774a72894597d878b",
  // KSP_KORC_ADDRESS : "0x6dc6bd65638b18057f7e6a2e8f136f3e77cc2038",
  // KLAY_REDi_ADDRESS : "0x5e9bc710d817affa64e0fd93f3f7602e9f4dd396",
  // KLAY_MNR_ADDRESS : "0xe641811d4a0c80d1260d4036df54d90559b9ab54",
  // KORC_KDAI_ADDRESS : "0x587a01f81e5c078cd7c03f09f45705530ffb7b94",
  KSP_KDAI_ADDRESS : "0x64e58f35e9d4e2ab6380908905177ce150aa8608",
  // KLAY_KDUCATO_ADDRESS : "0xfc4da06cf1d201b6cb9d99265614dac4937ad6a2",
  // KLAY_SSX_ADDRESS : "0x01d71c376425b4feccb7b8719a760110091b3eb9",
  // KLAY_TEMCO_ADDRESS : "0x2160db36b43cd6e2b71550d59f23d530f0578386",
  // ABL_KORC_ADDRESS : "0xa2867c345f9b7250fe6be6cccb6360dff9f6e38c",
  // KLAY_BEE_ADDRESS : "0x1453b3cbe0167dfac91204eb26822fc12208f516",
  KWBTC_KUSDT_ADDRESS : "0x9103beb39283da9c49b020d6546fd7c39f9bbc5b",
  // KLAY_WEMIX_ADDRESS : "0x917eed7ae9e7d3b0d875dd393af93fff3fc301f8",
  // KLAY_TRCL_ADDRESS : "0x8e4e386950f6c03b25d0f9aa8bd89c1b159e8aee",
  KSP_KXRP_ADDRESS : "0xa06b9a38a7b4b91cb5d9b24538296bfb3b97fbf3",
  KSP_KUSDT_ADDRESS : "0xe75a6a3a800a2c5123e67e3bde911ba761fe0705",
  // KLAY_WIKEN_ADDRESS : "0x6119b1540aa3bea20518f5e239f64d98ebe9aaff",
  // KLAY_SKLAY_ADDRESS : "0x073fde66b725d0ef5b54059aca22bbfc63a929ce",
  // KLAY_ISR_ADDRESS : "0x869440673a24e3c3f18c173d8a964b2f2621245b",
  // KLAY_KTRIX_ADDRESS : "0x0b8f6200597a3b75f4d1bf0668b8ecba2dc77afb",
  // KLAY_PIB_ADDRESS : "0x2ecdf3088488a8e91c332b9ee86bb87d4e9cce82",
  // KXRP_KDAI_ADDRESS : "0x4b50d0e4f29bf5b39a6234b11753fdb3b28e76fc",
  KETH_KWBTC_ADDRESS : "0x2a6a4b0c96ca98eb691a5ddcee3c7b7788c1a8e3",
  // KORC_KUSDT_ADRESS : "0x94F390a8438b5De00B868d3aE47863Db90fB92c3",
  // KSP_sKAI_ADDRESS : "0x6456acb56f9eeedb976d5d72b60fb31720155b75",
  // KLAY_sKAI_ADDRESS : "0x0734f80fbc2051e98e6c7cb37e08e067a9630c06",
  // KBELT_KORC_ADDRESS : "0x0f14648ed03a4172a0d186da51b66e7e9af6af66",
  // KUSDT_KAI_ADDRESS : "0x5787492d753d5f59365e2f98e2f18c3ae3bad6e7",
  // KLAY_KSTPL_ADDRESS : "0xfc61fbb57dd00765838a914e7d72a9eceb23ad80",
  // KLAY_KRAI_ADDRESS : "0xc19fe316a03f6bcc48498b67342b29d146fed349",
  // KLAY_KTON_ADDRESS : "0xd30339c1edb95e69e3b5b98f230d97b12f01d844",
  // KLAY_TURK_ADDRESS : "0x146117810f9ddd58741cca86a57006a65032c33f",
  // KLAY_KRUSH_ADDRESS : "0xdd79b37b8b90f7ce6c762120d74d5c9b85388629",
  // KLAY_KAUTO_ADDRESS : "0x11dd0daf4c80402ad61ea4f6b37ab60544188938",
  // KLAY_KQBZ_ADDRESS : "0x97575d656ec4122d022014d8dfd1ebe189e1ec69",
  // KLAY_BUZ_ADDRESS : "0x58fcf8638e8bfa38239d293960923ec7377aab40",
  // ABL_KORC_ADDRESS : "0xa2867c345f9b7250fe6be6cccb6360dff9f6e38c"
};
const TOKEN_DECIMAL = {
  KLAY : "18",
  KSP : "18",
  KORC : "18",
  KUSDT : "6",
  KETH : "18",
  KXRP : "6",
  KAUTO : "18",
  KTRIX : "18",
  KBELT : "18",
  KBNB : "18",
  KDAI : "18",
  CLBK : "18",
  AGOV : "18",
  ABL : "18",
  HIBS : "18",
  KHANDY : "18",
  BBC : "18",
  REDi : "18",
  MNR : "6",
  KDUCATO : "18",
  SSX : "18",
  TEMCO : "18",
  BEE : "18",
  WEMIX : "18",
  TRCL : "18",
  WIKEN : "18",
  SKLAY : "18",
  ISR : "18",
  PIB : "18",
  sKAI : "18",
  KSTPL : "18",
  KRAI : "18",
  SIX : "18",
  KTON : "18",
  TURK : "18",
  KRUSH : "18",
  KQBZ : "18",
  BUZ : "18",
  //////////////
  KWBTC : "8",
  HINT : "18",
  KAI : "18"
};
async function getCurrentPool(contract_address){

  return await caver.kas.wallet.callContract(contract_address, 'getCurrentPool');//tokenA와 tokenB의 balance가 연달아 담겨져 옵니다.

};
var data =  ''
async function test(){
  
  for(let contract_name in KSLP_ADDRESS){

    let getCurrentPool_res = await getCurrentPool(KSLP_ADDRESS[contract_name]);
    let tokenA_hex = (getCurrentPool_res.result).substring(0, 66);
    let tokenB_hex = (getCurrentPool_res.result).substring(66, 132);
    let tokenA_decimal = web3.eth.abi.decodeParameter("uint256", tokenA_hex);
    let tokenB_decimal = web3.eth.abi.decodeParameter("uint256", "0x"+tokenB_hex);

    let [ tokenAName, tokenBName ] = contract_name.split("_");   
    
    tokenA_decimal = tokenA_decimal / Math.pow(10, Number(TOKEN_DECIMAL[tokenAName]));
    tokenB_decimal = tokenB_decimal / Math.pow(10, Number(TOKEN_DECIMAL[tokenBName]));
    
    let ratio = tokenB_decimal / tokenA_decimal;

    console.log(` 1 ${tokenAName} = ${ratio} ${tokenBName}`);

    
    data += ` 1 ${tokenAName} = ${ratio} ${tokenBName}` + '\n';

    var fs = require('fs');
    fs.writeFile("data.txt", data, function(err) {
        if (err) {
            console.log(err);
        }
    });
  }
}
test();