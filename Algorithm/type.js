const Math = require("mathjs");
const safemath = require("safemath");
// constant variables
const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000000';
const DUMMY_MARKET = 'COINONE';
const DUMMY_RATIO = -1
const dex = [
    'KLAYSWAP',
    'DEFINIX',
    'MOUND'];
const KLAYSWAP_FEE = 0.003;
const DEFINIX_FEE = 0.002;
const DUMMY_DEX = 'not available';
const CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp
const MATRIX_SIZE = CurrencyLists.length;
const DUMMY_CURRENCY = 'MOUND';

// function Currency(name = DUMMY_CURRENCY) {
//     this.name = name;
// }
// const DUMMY_CURRENCY = new Currency('KLAY');

function Swap (from = "from", to = "to", ratio = DUMMY_RATIO, dex = DUMMY_DEX) {
    this.from = from;
    this.to = to;
    this.ratio = ratio;
    this.dex = dex;
    this.path = [from + " => " + to + ' at ' + dex];
    // this.path = [];
}
const DUMMY_SWAP = new Swap();

function refresh(swap){
    swap.path = [swap.from + " => " + swap.to + ' at ' + swap.dex];
}

function Market(name = DUMMY_MARKET, address = DUMMY_ADDRESS, pricelist = []) {
    this.name = name;
    this.address = address;
    this.pricelist = pricelist;
}

module.exports = {
    Math, safemath, DUMMY_ADDRESS, DUMMY_CURRENCY, DUMMY_DEX, DUMMY_MARKET, DUMMY_RATIO, dex, CurrencyLists, MATRIX_SIZE, DUMMY_SWAP, KLAYSWAP_FEE, DEFINIX_FEE,
    refresh, 
    Swap
}