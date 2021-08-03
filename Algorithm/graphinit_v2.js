// import
const type =  require('./type.js');
const cycle =  require('../cycle-detection.js');
const fs = require('fs');

async function graph(matrix_klayswap, matrix_definix){
    var swap_matrix = [];
    var swap_matrix2 = [];
    // init

    for (let i = 0; i < type.MATRIX_SIZE; i++) {
        var row1 = [];
        var row2 = [];
        for (let j = 0; j < type.MATRIX_SIZE; j++) {
            temp1 = new type.Swap(type.CurrencyLists[i], type.CurrencyLists[j], type.DUMMY_RATIO, type.DUMMY_DEX);
            temp2 = new type.Swap(type.CurrencyLists[i], type.CurrencyLists[j], type.DUMMY_RATIO, type.DUMMY_DEX);
            row1.push(temp1);
            row2.push(temp2);
        }
        swap_matrix.push(row1);
        swap_matrix2.push(row2);
    }

    //DEX Selection
    for(i=0; i < type.MATRIX_SIZE; i++){
        for(j=0; j < type.MATRIX_SIZE; j++){
            if(i == j) swap_matrix[i][j].ratio = 1;
            else if(matrix_klayswap[i][j].ratio >= matrix_definix[i][j].ratio){
                swap_matrix[i][j].ratio = matrix_klayswap[i][j].ratio;
                swap_matrix[i][j].dex = 'KLAYSWAP';
                swap_matrix2[i][j].dex = 'KLAYSWAP';
                type.refresh(swap_matrix[i][j]);
            }
            else{
                swap_matrix[i][j].ratio = matrix_definix[i][j].ratio;
                swap_matrix[i][j].dex = 'DEFINIX';
                swap_matrix2[i][j].dex = 'DEFINIX';
                type.refresh(swap_matrix[i][j]);
            }
        }
    }
    var set = new Set();
    for(t=0; t<3; t++){
        for(i=0; i<type.MATRIX_SIZE; i++){
            for(j=0; j<type.MATRIX_SIZE; j++){
                for(k=0; k<type.MATRIX_SIZE; k++){
                    if(swap_matrix[i][j].ratio < 0 || swap_matrix[j][k].ratio < 0 || i == j || j == k) continue;
                    const cycle_removed = cycle.safeconcat(swap_matrix[i][j], swap_matrix[j][k]);
                    const max_val = Math.max(swap_matrix[i][k].ratio, swap_matrix2[i][k].ratio, cycle_removed[1]);
                    switch(max_val){
                        case swap_matrix[i][k].ratio:
                            swap_matrix2[i][k].path = JSON.parse(JSON.stringify(swap_matrix[i][k].path));
                            swap_matrix2[i][k].ratio = max_val;
                            break;
                        case cycle_removed[1]:
                            // swap_matrix2[i][k].path = JSON.parse(JSON.stringify(swap_matrix[i][j].path.concat(swap_matrix[j][k].path)));
                            swap_matrix2[i][k].path = cycle_removed[0];
                            swap_matrix2[i][k].ratio = cycle_removed[1];
                            break;
                            
                    }
                    if(swap_matrix2[i][i].ratio > 1.0003) {
                        //WHEN TO BREAK?
                        // t = 10000;
                        set.add(JSON.stringify(swap_matrix2[i][i].path) + JSON.stringify(swap_matrix2[i][i].to) + JSON.stringify(swap_matrix2[i][i].ratio));
                        swap_matrix2[i][i].ratio = 1;
                        swap_matrix2[i][i].path = [];
                    }
                }
            }
        }
        if(JSON.stringify(swap_matrix2) == JSON.stringify(swap_matrix)) break;
        // console.log(JSON.stringify(swap_matrix2[3][2]));
        swap_matrix = JSON.parse(JSON.stringify(swap_matrix2));
    }

    // var jsondata = JSON.stringify(swap_matrix,null,2);
    var jsondata = '';
    for(i=0; i<type.MATRIX_SIZE; i++){
        for(j=0; j<type.MATRIX_SIZE; j++){
            jsondata += (JSON.stringify(swap_matrix[i][j].from.padEnd(5) + ' ' + swap_matrix[i][j].to.padEnd(5) + ' ' + swap_matrix[i][j].ratio.toString().padEnd(24) + ' ' + swap_matrix[i][j].dex.padEnd(10))).padEnd(45, ' ');
            jsondata += '\t';
            // jsondata += JSON.stringify(swap_matrix[i][j].path);
        }
        jsondata += '\n';
    }
    // jsondata.split();
    // console.log(jsondata);
    fs.writeFile("./Result/routing_data.txt", jsondata, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log(set);
    return swap_matrix
}


module.exports = {
    graph
}