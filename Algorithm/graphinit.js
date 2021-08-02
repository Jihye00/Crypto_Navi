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

var CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp
const MATRIX_SIZE = CurrencyLists.length;
const DUMMY_CURRENCY = 'MOUND';
const DUMMY_SWAP = new type.Swap();

function graph(matrix_klayswap, matrix_definix){
    var swap_matrix = [];
    var swap_matrix2 = [];
    // init
    for (let i = 0; i < MATRIX_SIZE; i++) {
        var row1 = [];
        var row2 = [];
        for (let j = 0; j < MATRIX_SIZE; j++) {
            temp1 = new type.Swap(CurrencyLists[i], CurrencyLists[j], DUMMY_RATIO, DUMMY_DEX);
            temp2 = new type.Swap(CurrencyLists[i], CurrencyLists[j], DUMMY_RATIO, DUMMY_DEX);
            row1.push(temp1);
            row2.push(temp2);
        }
        swap_matrix.push(row1);
        swap_matrix2.push(row2);
    }

    //DEX Selection
    for(i=0; i < MATRIX_SIZE; i++){
        for(j=0; j < MATRIX_SIZE; j++){
            if(i == j) swap_matrix[i][j].ratio = 1;
            else if(matrix_klayswap[i][j].ratio >= matrix_definix[i][j].ratio){
                swap_matrix[i][j].ratio = matrix_klayswap[i][j].ratio;
                swap_matrix[i][j].dex = 'KLAYSWAP';
                type.refresh(swap_matrix[i][j]);
            }
            else{
                swap_matrix[i][j].ratio = matrix_definix[i][j].ratio;
                swap_matrix[i][j].dex = 'DEFINIX';
                type.refresh(swap_matrix[i][j]);
            }
        }
    }
    var set = new Set();
    for(t=0; t<4; t++){
        for(i=0; i<MATRIX_SIZE; i++){
            for(j=0; j<MATRIX_SIZE; j++){
                for(k=0; k<MATRIX_SIZE; k++){
                    if(swap_matrix[i][j].ratio < 0 || swap_matrix[j][k].ratio < 0) continue;
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
                    if(swap_matrix2[i][i].ratio > 1) {
                        //WHEN TO BREAK?
                        t = 10000;
                        set.add(JSON.stringify(swap_matrix2[i][i].path) + JSON.stringify(swap_matrix2[i][i].to) + JSON.stringify(swap_matrix2[i][i].ratio));
                    }
                }
            }
        }
        if(JSON.stringify(swap_matrix2) == JSON.stringify(swap_matrix)) break;
        // console.log(JSON.stringify(swap_matrix2));
        swap_matrix = JSON.parse(JSON.stringify(swap_matrix2));
    }

    // var jsondata = JSON.stringify(swap_matrix,null,2);
    var jsondata = '';
    for(i=0; i<MATRIX_SIZE; i++){
        for(j=0; j<MATRIX_SIZE; j++){
            jsondata += JSON.stringify(swap_matrix[i][j].from + ' ' + swap_matrix[i][j].to + ' ' + swap_matrix[i][j].ratio);
        }
        jsondata += '\n';
    }
    // jsondata.split();
    fs.writeFile("./Result/result.txt", jsondata, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log(set);
}


module.exports = {
    graph
}