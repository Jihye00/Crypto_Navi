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

// function Currency(name = DUMMY_CURRENCY) {
//     this.name = name;
// }
// const DUMMY_CURRENCY = new Currency('KLAY');

function Swap (from = "from", to = "to", ratio = DUMMY_RATIO, dex = DUMMY_DEX) {
    this.from = from;
    this.to = to;
    this.ratio = ratio;
    this.dex = dex;
    this.path = [{'from': from, 'dex': dex}];
}

function refresh(swap){
    swap.path = [{'from': swap.from, 'dex': swap.dex}];
}
const DUMMY_SWAP = new Swap();

function Market(name = DUMMY_MARKET, address = DUMMY_ADDRESS, pricelist = []) {
    this.name = name;
    this.address = address;
    this.pricelist = pricelist;
}

module.exports = {
    refresh,
    Swap
}