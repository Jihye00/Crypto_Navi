// import
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
const MAX_RATIO = 1.1;
const MIN_RATIO = 0.9;

// given that we have list of cureency to deal with,
var klay = new Currency('KLAY');
var bnb = new Currency('BNB');
var usdt = new Currency('USDT');
var dai = new Currency('DAI');
var xrp = new Currency('XRP');
var btc = new Currency('BTC');
var six = new Currency('SIX');
var ksp = new Currency('KSP');
// const klay = new Currency('KLAY');
var CurrencyLists = [klay, bnb, usdt, dai, xrp, btc, six, ksp];
const MATRIX_SIZE = CurrencyLists.length;
// Currency Class
function Currency(name = DUMMY_CURRENCY) {
    this.name = name;
    // this.availableSwapList = availableSwapList;
}
const DUMMY_CURRENCY = new Currency('KLAY');

// Swap Class
function Swap(from = DUMMY_CURRENCY, to = DUMMY_CURRENCY, ratio = DUMMY_RATIO) {
    this.from = from;
    this.to = to;
    this.ratio = ratio; 
    // value : to_currency / from_currency
    // default : 0
}
const DUMMY_SWAP = new Swap();

function Market(name = DUMMY_MARKET, address = DUMMY_ADDRESS, pricelist = []) {
    this.name = name;
    this.address = address;
    this.pricelist = pricelist;
}

// given that exhcange rate is given as 
// _from _to _ratio, run the code bleow.
var swap_matrix = [
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],

    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP],
    [DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP,   DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP, DUMMY_SWAP]
];

// init
for (let i = 0; i < MATRIX_SIZE; i++) {
    for (let j = 0; j < MATRIX_SIZE; j++) {
        swap_matrix[i][j] = new Swap(CurrencyLists[i], CurrencyLists[j], DUMMY_RATIO)
    }
}

// -------------------------------------------------------- for test
// filling random ratio of lower diagonal
for (i = 0; i < MATRIX_SIZE; i++) {
    for (j = 0; j < MATRIX_SIZE; j++) {
        if (i == j) swap_matrix[i][j].ratio = 1;
        else if (i > j) swap_matrix[i][j].ratio = safemath.safeMule(Math.random(), (MAX_RATIO - MIN_RATIO) + MIN_RATIO);
    }
}

// filling ratio of upper diagonal
// and, should add exchange fee for now 0.3%
// Todo : exchange fee
for(i = 0; i < MATRIX_SIZE; i++){
    for(j = 0; j < MATRIX_SIZE; j++){
        if (swap_matrix[i][j].ratio == DUMMY_RATIO) swap_matrix[i][j].ratio = safemath.safeDiv(1 ,swap_matrix[j][i].ratio);
        else if(i != j) swap_matrix[i][j].ratio *= (1 - KLAYSWAP_FEE);
    }
}
console.log(JSON.stringify(swap_matrix));
// -------------------------------------------------------- for test
var jsondata1 = JSON.stringify(swap_matrix,null,2);
// jsondata.split();
var fs = require('fs');
fs.writeFile("initial.txt", jsondata1, function(err) {
    if (err) {
        console.log(err);
    }
});

for(t=0; t<MATRIX_SIZE; t++){
    for(i=0; i<MATRIX_SIZE; i++){
        for(j=0; j<MATRIX_SIZE; j++){
            for(k=0; k<MATRIX_SIZE; k++){
                swap_matrix[i][k].ratio = Math.max(swap_matrix[i][k].ratio, safemath.safeMule(swap_matrix[i][j].ratio ,swap_matrix[j][k].ratio));
            }
        }
    }
    // if(JSON.stringify(swap_matrix) == JSON.stringify(swap_matrix)) break;
    // console.log(JSON.stringify(swap_matrix));
    // matrix = matrix2;
}

var jsondata = JSON.stringify(swap_matrix,null,2);
// jsondata.split();
var fs = require('fs');
fs.writeFile("result.txt", jsondata, function(err) {
    if (err) {
        console.log(err);
    }
});

// console.log(swap_matrix);
// let Swaps = [
//     new Swap(),
//     new Swap(),
//     new Swap(),
//     new Swap()
// ];
// ​
// let Path = [];
// Path.push(CurrencyLists[0]);
// Path.push(Swaps[1]);
// Path.push(CurrencyLists[2]);
// Path.push(Swaps[3]);
// Path.push(CurrencyLists[1]);
// ​
// console.log(Path);