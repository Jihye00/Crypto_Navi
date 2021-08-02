// import
const Math = require("mathjs");
const safemath = require("safemath");
const type =  require('./type.js');
const fs = require('fs');
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
const DUMMY_DEX = 'MOUND';

// given that we have list of cureency to deal with,
// var klay = new Currency('KLAY');
// var kbnb = new Currency('KBNB');
// var kusdt = new Currency('KUSDT');
// var kdai = new Currency('KDAI');
// var kxrp = new Currency('KXRP');

// var keth = new Currency('KETH');
// var ksp = new Currency('KSP');
// var six = new Currency('SIX');
// var korc = new Currency('KORC');
// var kwbtc = new Currency('KWBTC');


// const klay = new Currency('KLAY');
// var CurrencyLists = [klay, kbnb, kusdt, kdai, kxrp, keth, ksp, six, korc, kwbtc]; // xrp, btc, six, ksp
var CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp
const MATRIX_SIZE = CurrencyLists.length;
const DUMMY_CURRENCY = 'MOUND';
const DUMMY_SWAP = new type.Swap();

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

for(i = 0; i< MATRIX_SIZE; i++) {
    for(j = 0; j<MATRIX_SIZE; j++) {
        if(i != j) {
            matrix_klayswap[i][j] *= (1 - KLAYSWAP_FEE);
            matrix_definix[i][j] *= (1 - DEFINIX_FEE);
        }
    }
}

for(i=0; i < MATRIX_SIZE; i++){
    for(j=0; j < MATRIX_SIZE; j++){
        if(i == j) continue
        else if(matrix_klayswap[i][j].ratio >= matrix_definix[i][j].ratio){
            swap_matrix[i][j].ratio = matrix_klayswap[i][j].ratio;
            swap_matrix[i][j].dex = 'KLAYSWAP';
        }
        else{
            swap_matrix[i][j].ratio = matrix_definix[i][j].ratio;
            swap_matrix[i][j].dex = 'DEFINIX';
        }
    }
}
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
fs.writeFile("result.txt", jsondata, function(err) {
    if (err) {
        console.log(err);
    }
});


module.exports = {
    
}