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
const DUMMY_DEX = 'MOUND';

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
var CurrencyLists = [klay, bnb, usdt, dai]; // xrp, btc, six, ksp
const MATRIX_SIZE = CurrencyLists.length;
// Currency Class
function Currency(name = DUMMY_CURRENCY) {
    this.name = name;
    // this.availableSwapList = availableSwapList;
}
const DUMMY_CURRENCY = new Currency('KLAY');

// Swap Class
function Swap(from = DUMMY_CURRENCY, to = DUMMY_CURRENCY, ratio = DUMMY_RATIO, dex = DUMMY_DEX) {
    this.from = from;
    this.to = to;
    this.ratio = ratio;
    this.path = [from.name];
    this.dex = dex;
}
const DUMMY_SWAP = new Swap();

function Market(name = DUMMY_MARKET, address = DUMMY_ADDRESS, pricelist = []) {
    this.name = name;
    this.address = address;
    this.pricelist = pricelist;
}

// given that exhcange rate is given as 
// _from _to _ratio, run the code bleow.
var swap_matrix = [];
for(i=0; i<MATRIX_SIZE; i++) {
    var row = [];
    for(j=0; j<MATRIX_SIZE; j++) row.push(DUMMY_SWAP);
    swap_matrix.push(row);
}
var swap_matrix2 = [];
for(i=0; i<MATRIX_SIZE; i++) {
    var row = [];
    for(j=0; j<MATRIX_SIZE; j++) row.push(DUMMY_SWAP);
    swap_matrix2.push(row);
}
// init
for (let i = 0; i < MATRIX_SIZE; i++) {
    for (let j = 0; j < MATRIX_SIZE; j++) {
        swap_matrix[i][j] = new Swap(CurrencyLists[i], CurrencyLists[j], DUMMY_RATIO, DUMMY_DEX)
        swap_matrix2[i][j] = new Swap(CurrencyLists[i], CurrencyLists[j], DUMMY_RATIO, DUMMY_DEX)
    }
}

// -------------------------------------------------------- for test
// filling random ratio of lower diagonal
for (i = 0; i < MATRIX_SIZE; i++) {
    for (j = 0; j < MATRIX_SIZE; j++) {
        if (i == j) swap_matrix[i][j].ratio = 1;
        // else if (i > j) swap_matrix[i][j].ratio = Math.random() * (MAX_RATIO - MIN_RATIO) + MIN_RATIO;
    }
}

//make matrix_klayswap and matrix_definix from csv file
const matrix_klayswap, matrix_definix;

// filling ratio of upper diagonal
// and, should add exchange fee for now 0.3%
// Todo : exchange fee
for(i = 0; i < MATRIX_SIZE; i++) {
    for(j = 0; j < MATRIX_SIZE; j++) {
        if (swap_matrix[i][j].ratio == DUMMY_RATIO) {
            matrix_klayswap[i][j].ratio = 1/matrix_klayswap[j][i].ratio;
            matrix_definix[i][j].ratio = 1/matrix_definix[j][i].ratio;
        }
        else if(i != j) {
            matrix_klayswap[i][j].ratio *= (1 - KLAYSWAP_FEE);
            matrix_definix[i][j].ratio += (1 - DEFINIX_FEE);
        }
    }
}

for(i=0; i < MATRIX_SIZE; i++){
    for(j=0; j < MATRIX_SIZE; j++){
        if(i == j) continue
        if(matrix_klayswap[i][j].ratio >= matrix_definix[i][j].ratio){
            swap_matrix[i][j].ratio = matrix_klayswap[i][j].ratio;
            swap_matrix[i][j].dex = 'KLAYSWAP';
        }
        else{
            swap_matrix[i][j].ratio = matrix_definix[i][j].ratio;
            swap_matrix[i][j].dex = 'DEFINIX';
        }
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

for(t=0; t<2; t++){
    for(i=0; i<MATRIX_SIZE; i++){
        for(j=0; j<MATRIX_SIZE; j++){
            for(k=0; k<MATRIX_SIZE; k++){
                // swap_matrix2[i][k].ratio = Math.max(swap_matrix[i][k].ratio, swap_matrix2[i][k].ratio, swap_matrix[i][j].ratio*swap_matrix[j][k].ratio);
                const max_val = Math.max(swap_matrix[i][k].ratio, swap_matrix2[i][k].ratio, safemath.safeMule(swap_matrix[i][j].ratio, swap_matrix[j][k].ratio));
                switch(max_val){
                    case swap_matrix[i][k].ratio:
                        swap_matrix2[i][k].path = JSON.parse(JSON.stringify(swap_matrix[i][k].path));
                        swap_matrix2[i][k].ratio = max_val;
                        break;
                    case safemath.safeMule(swap_matrix[i][j].ratio, swap_matrix[j][k].ratio):
                        swap_matrix2[i][k].path = JSON.parse(JSON.stringify(swap_matrix[i][j].path.concat(swap_matrix[j][k].path)));
                        swap_matrix2[i][k].ratio = max_val;
                        break;
                }
                if(t < 10000 && swap_matrix2[i][i].ratio > 1) {
                    console.log("Arbitrage Opportunity", swap_matrix2[i][i].from, swap_matrix2[i][i].path, swap_matrix2[i][i].to, swap_matrix2[i][i].ratio);
                    t=10000;
                }
            }
        }
    }
    if(JSON.stringify(swap_matrix2) == JSON.stringify(swap_matrix)) break;
    console.log(JSON.stringify(swap_matrix2));
    swap_matrix = JSON.parse(JSON.stringify(swap_matrix2));
}

// var jsondata = JSON.stringify(swap_matrix,null,2);
var jsondata = '';
for(i=0; i<MATRIX_SIZE; i++){
    for(j=0; j<MATRIX_SIZE; j++){
        jsondata += JSON.stringify(swap_matrix[i][j].from.name + ' ' + swap_matrix[i][j].to.name + ' ' + swap_matrix[i][j].ratio);
    }
    jsondata += '\n';
}
// jsondata.split();
var fs = require('fs');
fs.writeFile("result.txt", jsondata, function(err) {
    if (err) {
        console.log(err);
    }
});
