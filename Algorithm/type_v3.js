const Math = require("mathjs");
const safemath = require("safemath");
// constant variables
const dex = [
    'KLAYSWAP',
    'DEFINIX',
    'MOUND'];
const KLAYSWAP_FEE = 0.003;
const DEFINIX_FEE = 0.0025;
const CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC', 'FINIX']; // xrp, btc, six, ksp
const MATRIX_SIZE = CurrencyLists.length;
var SwapMatrix = [];

class Swap{
    constructor(from, to){
        this.from = from;
        this.to = to;
        this.num = 0;
    }
    add_ele(dex, x, y){
        switch(this.num){
            case 0:
                this.dex1 = dex;
                this.x1 = x;
                this.y1 = y;
                this.k1 = x * y;
                break;
            case 1:
                if(this.y1/this.x1 > y/x){
                    this.dex2 = dex;
                    this.x2 = x;
                    this.y2 = y;
                    this.k2 = x * y;
                }
                else{
                    this.dex2 = this.dex1;
                    this.x2 = this.x1;
                    this.y2 = this.y1;
                    this.k2 = this.k1;
                    this.dex1 = dex;
                    this.x1 = x;
                    this.y1 = y;
                    this.k1 = x * y;
                }
                this.limitone = Math.sqrt(safemath.safeMule(this.k1, this.x2) / this.y2) - this.x1;
                break;
            default:
                console.log("WARNING!");
        }
        this.num++;
    }
    ratio(a){
        var result = {};
        if(this.num == 0){
            result['KLAYSWAP'] = [0, 0];
            result['DEFINIX'] = [0, 0];
        }
        else if(this.num == 1 || this.limitone >= a){
            const dex1 = this.dex1;
            const b = this.y1 - this.k1/(this.x1+a);
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a, b * (1-KLAYSWAP_FEE)];
                result['DEFINIX'] = [0, 0];
            }
            else{
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [a, b * (1-DEFINIX_FEE)];
            }
        }
        else{
            const a1 = safemath.safeDiv(Math.sqrt(this.k1)*(this.x2+a)-Math.sqrt(this.k2)*this.x1, Math.sqrt(this.k1)+Math.sqrt(this.k2));
            const a2 = a - a1;
            const b1 = this.y1 - this.k1/(this.x1+a1);
            const b2 = this.y2 - this.k2/(this.x2+a2);
            const dex1 = this.dex1;
            const dex2 = this.dex2;
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a1, b1 * (1-KLAYSWAP_FEE)];
                result['DEFINIX'] = [a2, b2 * (1-DEFINIX_FEE)];
            }
            else {
                result['DEFINIX'] = [a1, b1 * (1-KLAYSWAP_FEE)];
                result['KLAYSWAP'] = [a2, b2 * (1-DEFINIX_FEE)];
            }
            // if(a > this.x1 + this.x2 || a1 < 0 || a2 < 0){
            //     result['KLAYSWAP'] = [0, 0];
            //     result['DEFINIX'] = [0, 0];
            // }
        }
        return result;
    }
}

function index_finder(currency){
    for(var i=0; i<MATRIX_SIZE; i++){
        if(CurrencyLists[i] == currency){
            return i;
        }
    }
    return MATRIX_SIZE+1;
}

class Route_Matrix{
    constructor(currency_list){
        this.currency_list = currency_list.slice();
        this.matrix = [];
        this.size = currency_list.length;
        for(var i=0; i<this.size; i++){
            var row = [];
            for(var j=0; j<this.size; j++){
                if(i==j) row.push({'money' : 1, 'path' : []});
                else row.push({'money' : 0, 'path' : []});
            }
            this.matrix.push(row);
        }
        this.arbitrage = new Set();
    }
    copy(Route_Matrix){
        return new Route_Matrix(this.currency_list);
    }
    calc_init(from, a){
        var idx = index_finder(from);
        for(var j=0; j<this.size; j++){
            if(idx == j) continue;
            var ratio = SwapMatrix[idx][j].ratio(a);
            this.matrix[idx][j]['money'] = ratio['KLAYSWAP'][1] + ratio['DEFINIX'][1];
            if(this.matrix[idx][j]['money'] > 0) this.matrix[idx][j]['path'] = [from+','+this.currency_list[j]+',KLAYSWAP,'+String(ratio['KLAYSWAP'][0])+',DEFINIX,'+String(ratio['DEFINIX'][0])];
        }
        for(var i=0; i<this.size; i++){
            if(i == idx) continue;
            var money = this.matrix[idx][i]['money'];
            for(var j=0; j<this.size; j++){
                ratio = SwapMatrix[i][j].ratio(money);
                if(ratio['KLAYSWAP'][1] + ratio['DEFINIX'][1] > this.matrix[i][j]['money']){
                    this.matrix[i][j]['money'] = ratio['KLAYSWAP'][1] + ratio['DEFINIX'][1];
                    this.matrix[i][j]['path'] = [from+','+this.currency_list[j]+',KLAYSWAP,'+String(ratio['KLAYSWAP'][0])+',DEFINIX,'+String(ratio['DEFINIX'][0])];
                }
                if(this.matrix[i][i]['money'] > 1.0003){
                    this.arbitrage.add(toString(this.matrix[i][i]['money'])+','+this.matrix[i][j]['path'].join('=>'));
                    this.matrix[i][i]['money'] = 1;
                    this.matrix[i][i]['path'] = [];
                }
            }
        }
    }
    safeconcat(path1, k){
        var str = path1[path1.length - 1].split(',');
        var i = index_finder(str[0]);
        var j = index_finder(str[1]);
        var k_money = Number(str[3]);
        var d_money = Number(str[5]);
        var ratio1 = SwapMatrix[i][j].ratio(k_money+d_money);
        var money = ratio1['KLAYSWAP'][1] + ratio1['DEFINIX'][1];
        var ratio2 = SwapMatrix[j][k].ratio(money);
        var new_path = path1.slice();
        new_path.push(this.currency_list[j]+','+this.currency_list[k]+',KLAYSWAP,'+String(ratio2['KLAYSWAP'][0])+',DEFINIX,'+String(ratio2['DEFINIX'][0]));
        money = ratio2['KLAYSWAP'][1] + ratio2['DEFINIX'][1];
        // console.log(new_path);
        return [new_path, money];
    }
    calc(T, from, a){
        this.calc_init(from, a);
        var new_matrix = [];
        for(var i=0; i<this.size; i++){
            var row = [];
            for(var j=0; j<this.size; j++){
                if(i==j) row.push({'money' : 1, 'path' : []});
                else row.push({'money' : 0, 'path' : []});
            }
            new_matrix.push(row);
        }
        for(var t=0; t<T; t++){
            for(var i=0; i<this.size; i++){
                for(var j=0; j<this.size; j++){
                    for(var k=0; k<this.size; k++){
                        if(this.matrix[i][j]['money'] == 0 || this.matrix[j][k]['money'] == 0 || i == j || j == k) continue;
                        var cycle_removed = this.safeconcat(this.matrix[i][j]['path'], k);
                        const max_val = Math.max(new_matrix[i][k]['money'], this.matrix[i][k]['money'], cycle_removed[1]);
                        switch(max_val){
                            case this.matrix[i][k]['money']:
                                new_matrix[i][k]['money'] = this.matrix[i][k]['money'];
                                new_matrix[i][k]['path'] = JSON.parse(JSON.stringify(this.matrix[i][k]['path']));
                                break;
                            case cycle_removed[1]:
                                new_matrix[i][k]['path'] = cycle_removed[0];
                                new_matrix[i][k]['money'] = cycle_removed[1];
                                break;
                        }
                        if(i == k && new_matrix[i][i]['money'] > 1.0003) {
                            this.arbitrage.add(toString(this.matrix[i][i]['money'])+','+this.matrix[i][j]['path'].join('=>'));
                            this.matrix[i][i]['money'] = 1;
                            this.matrix[i][i]['path'] = [];
                        }
                    }
                }
            }
            if(JSON.stringify(new_matrix) == JSON.stringify(this.matrix)) break;
            var temp = this.matrix;
            this.matrix = new_matrix;
            new_matrix = temp;
        }
    }
    print(){
        for(var i=0; i<this.size; i++){
            for(var j=0; j<this.size; j++){
                console.log(this.currency_list[i]+'=>'+this.currency_list[j]+':'+this.matrix[i][j]['path']+this.matrix[i][j]['money']);
            }
            console.log('\n');
        }
    }
}

for(var i=0; i<MATRIX_SIZE; i++){
    var row = [];
    for(var j=0; j<MATRIX_SIZE; j++){
        s = new Swap(CurrencyLists[i], CurrencyLists[j])
        row.push(s);
    }
    SwapMatrix.push(row);
}

module.exports = {
    Math, safemath, CurrencyLists, MATRIX_SIZE,
    Swap,
    Route_Matrix,
    SwapMatrix,
    index_finder
}