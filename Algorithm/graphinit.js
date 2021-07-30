// import
const Math = require("mathjs");

// constant variables
const DUMMY_ADDRESS = '0x0000000000000000000000000000000000000000';
const DUMMY_MARKET = 'COINONE';
const dex = [
    'KLAYSWAP',
    'DEFINIX'];
const KLAYSWAP_FEE = 0.003;
const DEFINIX_FEE = 0.002;

// Currency Class
function Currency(name = DUMMY_CURRENCY) {
    this.name = name;
    // this.availableSwapList = availableSwapList;
}
const DUMMY_CURRENCY = new Currency('KLAY');

// Swap Class
function Swap(from = DUMMY_CURRENCY, to = DUMMY_CURRENCY, ratio = 0) {
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

// given that we have list of cureency to deal with,
var klay = new Currency('KLAY');
var bnb = new Currency('BNB');
var usdt = new Currency('USDT');
var dai = new Currency('dai');
var xrp = new Currency('XRP');
var btc = new Currency('BTC');
var six = new Currency('SIX');
var ksp = new Currency('KSP');
// const klay = new Currency('KLAY');
var CurrencyLists = [klay, bnb, usdt, dai, xrp, btc, six, ksp];
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

for (curr_from in CurrencyLists) {
    for (curr_to in CurrencyLists) {
        matrix
    } 
}



// var matrix = {'KLAY':{'KLAY':1, 'USDT':1.006862, 'ETH':0.000437}, 
// 'USDT':{'KLAY':0.993184, 'USDT':1, 'ETH':0.000435}, 
// 'ETH':{'KLAY':2288.33, 'USDT':2294.875, 'ETH':1}};

// for(const i in matrix){
//     for(const j in i){
//         if(i != j) matrix[i][j] *= 0.997;
//     }
// }

// for(k=0; k<3; k++){
//     var matrix2 = {'KLAY':{'KLAY':1, 'USDT':1.006862, 'ETH':0.000437}, 
//     'USDT':{'KLAY':0.993184, 'USDT':1, 'ETH':0.000435}, 
//     'ETH':{'KLAY':2288.33, 'USDT':2294.875, 'ETH':1}};
//     for(const i in matrix){
//         for(const j in i){
//             for(const m in i){
//                 if(matrix[i][m]*matrix[m][j] > matrix2[i][j]) matrix2[i][j] = matrix[i][m]*matrix[m][j];
//             }
//         }
//     }
//     console.log(matrix);
// }
const ele = 16;
//[WETH, CAKE, USDT]

// var matrix = [
//     [1, 153.877, 2284.51],
//     [1/153.877, 1, 14.7963],
//     [1/2284.51, 1/14.7963, 1]
// ];

//[BNB, BUSD, USDT]
// var matrix = [
//     [1, 312.113, 311.965],
//     [1/312.113, 1, 1/1.00155],
//     [1/311.965, 1.00155, 1]
// ];

//[WETH, CAKE, USDT]
// var matrix = [
//     [1, 1/0.00650912, 1/0.00043135],
//     [0.00650912, 1, 15.14555963],
//     [0.00043135, 1/15.14555963, 1]
// ];

var matrix = [
    [1, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],

    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],

    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],

    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0]
];

for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
        if (i == j) matrix[i][j] = 1;
        else if (i > j) matrix[i][j] = 1 / Math.random();
    }
}
console.log(matrix);
for(i=0; i<ele; i++){
    for(j=0; j<ele; j++){
        if (matrix[i][j] == 0) matrix[i][j] = 1/matrix[j][i];
        if(i != j) matrix[i][j] *= 0.997;
    }
}
// console.log(matrix);

var matrix2 = [
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],

    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
 
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
 
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0],
    [0, 0, 0, 0,   0, 0, 0, 0,   0, 0, 0, 0,  0, 0, 0, 0]
];

for(t=0; t<ele; t++){
    for(i=0; i<ele; i++){
        for(j=0; j<ele; j++){
            for(k=0; k<ele; k++){
                matrix2[i][k] = Math.max(matrix2[i][k], matrix[i][k], matrix[i][j]*matrix[j][k]);
            }
        }
    }
    if(JSON.stringify(matrix) == JSON.stringify(matrix2)) break;
    console.log(matrix2);
    matrix = matrix2;
}

for(t=0; t<ele; t++){
    for(i=0; i<ele; i++){
        for(j=0; j<ele; j++){
            for(k=0; k<ele; k++){
                matrix2[i][k] = Math.max(matrix2[i][k], matrix[i][k], matrix[i][j]*matrix[j][k]);
            }
        }
    }
    if(JSON.stringify(matrix) == JSON.stringify(matrix2)) break;
    console.log(matrix2);
    matrix = matrix2;
}
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