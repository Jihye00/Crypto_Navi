
const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000000';
const DUMMY_CURRENCY = 'MOUND';
const DUMMY_MARKET = 'COINONE';
const dex = [
    'KLAYSWAP',
    'DEFINIX'];

function Currency(name = DUMMY_CURRENCY, availableSwapList) {
    this.name = name;
    this.availableSwapList = availableSwapList;
}

function Swap(address = DUMMY_ADDRESS, from = DUMMY_CURRENCY, to = DUMMY_CURRENCY, ratio = 0, fee_rate = 0.3) {
    this.address = address;
    this.from = from;
    this.to = to;
    this.ratio = ratio; 
    // value : to_currency / from_currency
    // default : 0
    this.fee_rate = fee_rate;
    // value : percentage
    // default : 0.3%
}

function Market(nmae = DUMMY_MARKET, address = DUMMY_ADDRESS, pricelist = []) {
    this.name = name;
    this.address = address;
    this.pricelist = pricelist;

}


let CurrencyLists = [
    new Currency(DUMMY_ADDRESS, 'KLAY', 'au'),
    new Currency(DUMMY_ADDRESS, 'mary', 'us')
];

let Swaps = [
    new Swap(),
    new Swap(),
    new Swap(),
    new Swap()
];

let Path = [];
Path.push(CurrencyLists[0]);
Path.push(Swaps[1]);
Path.push(CurrencyLists[2]);
Path.push(Swaps[3]);
Path.push(CurrencyLists[1]);

// import "./graph.js";

// given a matrix m1

var m1 = [
    []
    []
    []
]