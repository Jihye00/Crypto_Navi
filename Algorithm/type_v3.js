const Math = require("mathjs");
const safemath = require("safemath");
// constant variables
const dex = [
    'KLAYSWAP',
    'DEFINIX'];
const KLAYSWAP_FEE = 0.003;
const DEFINIX_FEE = 0.002;
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
                if(dex == 'KLAYSWAP') this.fee1 = 1 - KLAYSWAP_FEE;
                else this.fee1 = 1 - DEFINIX_FEE;
                break;
            case 1:
                if(this.y1/this.x1 > y/x){
                    this.dex2 = dex;
                    this.x2 = x;
                    this.y2 = y;
                    this.k2 = x * y;
                    if(dex == 'KLAYSWAP') this.fee2 = 1 - KLAYSWAP_FEE;
                    else this.fee2 = 1 - DEFINIX_FEE;
                }
                else{
                    this.dex2 = this.dex1;
                    this.x2 = this.x1;
                    this.y2 = this.y1;
                    this.k2 = this.k1;
                    this.fee2 = this.fee1;
                    this.dex1 = dex;
                    this.x1 = x;
                    this.y1 = y;
                    this.k1 = x * y;
                    if(dex == 'KLAYSWAP') this.fee1 = 1 - KLAYSWAP_FEE;
                    else this.fee1 = 1 - DEFINIX_FEE;
                }
                this.limitone = (Math.sqrt(safemath.safeMule(this.k1, this.x2) / this.y2) - this.x1) / this.fee1;
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
            result['slippage'] = 1;
        }
        else if(this.num == 1 || this.limitone >= a){
            const dex1 = this.dex1;
            const b = this.y1 - this.k1/(this.x1 + a * this.fee1);
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a, b];
                result['DEFINIX'] = [0, 0];
            }
            else{
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [a, b];
            }
            result['slippage'] = (b/a*this.fee1)/(this.y1/this.x1);
        }
        else{
            const a1 = safemath.safeDiv(Math.sqrt(this.k1)*(this.x2+a*this.fee2)-Math.sqrt(this.k2)*this.x1, Math.sqrt(this.k1)*this.fee2+Math.sqrt(this.k2)*this.fee1);
            const a2 = a - a1;
            const b1 = this.y1 - this.k1/(this.x1 + a1 * this.fee1);
            const b2 = this.y2 - this.k2/(this.x2 + a2 * this.fee2);
            const dex1 = this.dex1;
            const dex2 = this.dex2;
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a1, b1];
                result['DEFINIX'] = [a2, b2];
            }
            else {
                result['DEFINIX'] = [a1, b1];
                result['KLAYSWAP'] = [a2, b2];
            }
            if(a > this.x1 + this.x2 || a1 < 0 || a2 < 0){
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [0, 0];
            }
            result['slippage'] = ((b1+b2)/(a1*this.fee1+a2*this.fee2)) / (((this.y1/this.x1)*a1+(this.y2/this.x2)*a2)/(a1+a2));
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
                row.push({'money' : 0, 'path' : [], 'slippage' : 1});
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
            this.matrix[idx][j]['slippage'] = ratio['slippage'];
        }
        for(var i=0; i<this.size; i++){
            if(i == idx) continue;
            var money = this.matrix[idx][i]['money'];
            for(var j=0; j<this.size; j++){
                ratio = SwapMatrix[i][j].ratio(money);
                if(ratio['KLAYSWAP'][1] + ratio['DEFINIX'][1] > this.matrix[i][j]['money']){
                    this.matrix[i][j]['money'] = ratio['KLAYSWAP'][1] + ratio['DEFINIX'][1];
                    this.matrix[i][j]['path'] = [from+','+this.currency_list[j]+',KLAYSWAP,'+String(ratio['KLAYSWAP'][0])+',DEFINIX,'+String(ratio['DEFINIX'][0])];
                    this.matrix[i][j]['slippage'] = ratio['slippage'];
                }
                if(this.matrix[i][i]['money'] > this.matrix[idx][i]['money']){
                    this.arbitrage.add(toString(this.matrix[i][i]['money'])+','+this.matrix[i][j]['path'].join('=>'));
                    this.matrix[i][i]['money'] = 1;
                    this.matrix[i][i]['path'] = [];
                    this.matrix[i][i]['slippage'] = 1;
                }
            }
        }
    }
    safeconcat(path1, k){
        var str = path1[path1.length - 1].split(',');
        var i = index_finder(str[0]);
        var j = index_finder(str[1]);
        for(var a=0; a<path1.length; a++){
            var t_str = path1[a].split(',');
            if(t_str[0] == str[1] && t_str[1] == this.currency_list[k]){
                return [null, -1, 0];
            }
        }
        var k_money = Number(str[3]);
        var d_money = Number(str[5]);
        var ratio1 = SwapMatrix[i][j].ratio(k_money+d_money);
        var money = ratio1['KLAYSWAP'][1] + ratio1['DEFINIX'][1];
        var ratio2 = SwapMatrix[j][k].ratio(money);
        var new_path = path1.slice();
        new_path.push(this.currency_list[j]+','+this.currency_list[k]+',KLAYSWAP,'+String(ratio2['KLAYSWAP'][0])+',DEFINIX,'+String(ratio2['DEFINIX'][0]));
        money = ratio2['KLAYSWAP'][1] + ratio2['DEFINIX'][1];
        return [new_path, money, ratio1['slippage']*ratio2['slippage']];
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
                                new_matrix[i][k]['slippage'] = this.matrix[i][k]['slippage'];
                                break;
                            case cycle_removed[1]:
                                new_matrix[i][k]['path'] = cycle_removed[0];
                                new_matrix[i][k]['money'] = cycle_removed[1];
                                new_matrix[i][k]['slippage'] = cycle_removed[2];
                                break;
                        }
                        if(i == k && new_matrix[i][i]['path'].length > 1) {
                            if(this.matrix[index_finder(from)][i]['money'] != 0 && new_matrix[i][i]['money'] > this.matrix[index_finder(from)][i]['money']) this.arbitrage.add(String(new_matrix[i][i]['money'])+'+'+new_matrix[i][i]['path'].join('=>'));
                            new_matrix[i][i]['money'] = 0;
                            new_matrix[i][i]['path'] = [];
                            new_matrix[i][i]['slippage'] = 1;
                        }
                    }
                }
            }
            if(JSON.stringify(new_matrix) == JSON.stringify(this.matrix)) {
                console.log(t);
                break;
            }
            var temp = this.matrix;
            this.matrix = new_matrix;
            new_matrix = temp;
        }
        console.log("ARBITRAGE: "+JSON.stringify(this.arbitrage));
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