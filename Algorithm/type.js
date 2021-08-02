const Math = require("mathjs");
const safemath = require("safemath");
// constant variables
const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000000';
const DUMMY_MARKET = 'COINONE';
const DUMMY_RATIO = -1
const dex = [
    'KLAYSWAP',
    'DEFINIX'];
const KLAYSWAP_FEE = 0.003;
const DEFINIX_FEE = 0.002;
const DUMMY_DEX = 'MOUND';


function Currency(name = DUMMY_CURRENCY) {
    this.name = name;
    // this.availableSwapList = availableSwapList;
}
const DUMMY_CURRENCY = new Currency('KLAY');

function Swap (from = "NONE", to = "NONE", ratio = DUMMY_RATIO, dex = DUMMY_DEX) {
    this.from = from;
    this.to = to;
    this.ratio = ratio;
    this.dex = dex;

    this.path = [from];
}
// function Swap2(from = DUMMY_CURRENCY, to = DUMMY_CURRENCY, ratio = DUMMY_RATIO, dex = DUMMY_DEX) {
//     this.from = from;
//     this.to = to;
//     this.ratio = ratio;
//     this.path = [from.name];
//     this.dex = dex;
// }
const DUMMY_SWAP = new Swap();

module.exports = {
    Swap,
    Currency
}