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
                this.k1 = safemath.safeMule(x, y);
                if(dex == 'KLAYSWAP') this.fee1 = safemath.safeSub(1, KLAYSWAP_FEE);
                else this.fee1 = safemath.safeSub(1, DEFINIX_FEE);
                this.num++;
                break;
            case 1:
                if(safemath.safeDiv(this.y1, this.x1) > safemath.safeDiv(y, x)){
                    this.dex2 = dex;
                    this.x2 = x;
                    this.y2 = y;
                    this.k2 = safemath.safeMule(x, y);
                    if(dex == 'KLAYSWAP') this.fee2 = safemath.safeSub(1, KLAYSWAP_FEE);
                    else this.fee2 = safemath.safeSub(1, DEFINIX_FEE);
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
                    this.k1 = safemath.safeMule(x, y);
                    if(dex == 'KLAYSWAP') this.fee1 = safemath.safeSub(1, KLAYSWAP_FEE);
                    else this.fee1 = safemath.safeSub(1, DEFINIX_FEE);
                }
                var temp = Math.sqrt(safemath.safeMule(safemath.safeMule(this.x1, this.y1), safemath.safeDiv(this.x2, this.y2)))
                this.limitone = safemath.safeDiv(safemath.safeSub(temp, this.x1), this.fee1);
                this.num++;
                break;
            // default:
            //     console.log("WARNING!", this.num);
        }
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
            const b = safemath.safeSub(this.y1, safemath.safeDiv(this.k1, safemath.safeAdd(this.x1, safemath.safeMule(a, this.fee1))));
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a, b];
                result['DEFINIX'] = [0, 0];
            }
            else{
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [a, b];
            }
            result['slippage'] = safemath.safeDiv(safemath.safeMule(b, this.x1), safemath.safeMule(a, safemath.safeMule(this.fee1, this.y1)));
        }
        else{
            var temp = safemath.safeSub(safemath.safeMule(Math.sqrt(this.k1), safemath.safeAdd(this.x2, safemath.safeMule(a, this.fee2))), safemath.safeMule(this.x1, Math.sqrt(this.k2)))
            const a1 = safemath.safeDiv(temp, safemath.safeAdd(safemath.safeMule(Math.sqrt(this.k1), this.fee2), safemath.safeMule(Math.sqrt(this.k2), this.fee1)));
            const a2 = safemath.safeSub(a, a1);
            const b1 = safemath.safeSub(this.y1, safemath.safeDiv(this.k1, safemath.safeAdd(this.x1, safemath.safeMule(a1, this.fee1))));
            const b2 = safemath.safeSub(this.y2, safemath.safeDiv(this.k2, safemath.safeAdd(this.x2, safemath.safeMule(a2, this.fee2))));
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
            if(a > safemath.safeAdd(this.x1, this.x2) || a1 < 0 || a2 < 0){
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [0, 0];
            }
            var temp1 = safemath.safeDiv(safemath.safeAdd(b1, b2), safemath.safeAdd(safemath.safeMule(a1, this.fee1), safemath.safeMule(a2, this.fee2)));
            var temp2 = safemath.safeDiv(safemath.safeAdd(safemath.safeMule(safemath.safeDiv(this.y1, this.x1), a1), safemath.safeMule(safemath.safeDiv(this.y2, this.x2), a2)), safemath.safeAdd(a1, a2));
            result['slippage'] = safemath.safeDiv(temp1, temp2);
        }
        return result;
    }
}

function index_finder(currency){
    for(var i1=0; i1<MATRIX_SIZE; i1++){
        if(CurrencyLists[i1] == currency){
            return i1;
        }
    }
    return safemath.safeAdd(MATRIX_SIZE, 1);
}

class Route_Matrix{
    constructor(currency_list){
        this.currency_list = currency_list.slice();
        this.matrix = [];
        this.size = currency_list.length;
        for(var i2=0; i2<this.size; i2++){
            var row = [];
            for(var j1=0; j1<this.size; j1++){
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
        for(var j2=0; j2<this.size; j2++){
            if(idx == j2) continue;
            var ratio = SwapMatrix[idx][j2].ratio(a);
            this.matrix[idx][j2]['money'] = safemath.safeAdd(ratio['KLAYSWAP'][1], ratio['DEFINIX'][1]);
            if(this.matrix[idx][j2]['money'] > 0) this.matrix[idx][j2]['path'] = [from+','+this.currency_list[j2]+',KLAYSWAP,'+String(ratio['KLAYSWAP'][0])+',DEFINIX,'+String(ratio['DEFINIX'][0])];
            this.matrix[idx][j2]['slippage'] = ratio['slippage'];
        }
        for(var i3=0; i3<this.size; i3++){
            if(i3 == idx) continue;
            var money = this.matrix[idx][i3]['money'];
            for(var j3=0; j3<this.size; j3++){
                ratio = SwapMatrix[i3][j3].ratio(money);
                if(safemath.safeAdd(ratio['KLAYSWAP'][1], ratio['DEFINIX'][1]) > this.matrix[i3][j3]['money']){
                    this.matrix[i3][j3]['money'] = safemath.safeAdd(ratio['KLAYSWAP'][1], ratio['DEFINIX'][1]);
                    this.matrix[i3][j3]['path'] = [from+','+this.currency_list[j3]+',KLAYSWAP,'+String(ratio['KLAYSWAP'][0])+',DEFINIX,'+String(ratio['DEFINIX'][0])];
                    this.matrix[i3][j3]['slippage'] = ratio['slippage'];
                }
                if(this.matrix[i3][i3]['money'] > this.matrix[idx][i3]['money']){
                    this.arbitrage.add(toString(this.matrix[i3][i3]['money'])+','+this.matrix[i3][j3]['path'].join('=>'));
                    this.matrix[i3][i3]['money'] = 1;
                    this.matrix[i3][i3]['path'] = [];
                    this.matrix[i3][i3]['slippage'] = 1;
                }
            }
        }
    }
    safeconcat(path1, k){
        var str = path1[safemath.safeSub(path1.length, 1)].split(',');
        var i4 = index_finder(str[0]);
        var j4 = index_finder(str[1]);
        for(var a=0; a<path1.length; a++){
            var t_str = path1[a].split(',');
            if(t_str[0] == str[1] && t_str[1] == this.currency_list[k]){
                return [null, -1, 0];
            }
        }
        var k_money = Number(str[3]);
        var d_money = Number(str[5]);
        var ratio1 = SwapMatrix[i4][j4].ratio(safemath.safeAdd(k_money, d_money));
        var money = ratio1['KLAYSWAP'][1] + ratio1['DEFINIX'][1];
        var ratio2 = SwapMatrix[j4][k].ratio(money);
        var new_path = path1.slice();
        new_path.push(this.currency_list[j4]+','+this.currency_list[k]+',KLAYSWAP,'+String(ratio2['KLAYSWAP'][0])+',DEFINIX,'+String(ratio2['DEFINIX'][0]));
        money = safemath.safeAdd(ratio2['KLAYSWAP'][1], ratio2['DEFINIX'][1]);
        return [new_path, money, safemath.safeMule(ratio1['slippage'], ratio2['slippage'])];
    }
    calc(T, from, a){
        this.calc_init(from, a);
        var new_matrix = [];
        for(var i5=0; i5<this.size; i5++){
            var row = [];
            for(var j5=0; j5<this.size; j5++){
                if(i5==j5) row.push({'money' : 1, 'path' : []});
                else row.push({'money' : 0, 'path' : []});
            }
            new_matrix.push(row);
        }
        for(var t1=0; t1<T; t1++){
            for(var i6=0; i6<this.size; i6++){
                for(var j6=0; j6<this.size; j6++){
                    for(var k6=0; k6<this.size; k6++){
                        if(this.matrix[i6][j6]['money'] == 0 || this.matrix[j6][k6]['money'] == 0 || i6 == j6 || j6 == k6) continue;
                        var cycle_removed = this.safeconcat(this.matrix[i6][j6]['path'], k6);
                        const max_val = Math.max(new_matrix[i6][k6]['money'], this.matrix[i6][k6]['money'], cycle_removed[1]);
                        switch(max_val){
                            case this.matrix[i6][k6]['money']:
                                new_matrix[i6][k6]['money'] = this.matrix[i6][k6]['money'];
                                new_matrix[i6][k6]['path'] = JSON.parse(JSON.stringify(this.matrix[i6][k6]['path']));
                                new_matrix[i6][k6]['slippage'] = this.matrix[i6][k6]['slippage'];
                                break;
                            case cycle_removed[1]:
                                new_matrix[i6][k6]['path'] = cycle_removed[0];
                                new_matrix[i6][k6]['money'] = cycle_removed[1];
                                new_matrix[i6][k6]['slippage'] = cycle_removed[2];
                                break;
                        }
                        if(i6 == k6 && new_matrix[i6][i6]['path'].length > 1) {
                            if(this.matrix[index_finder(from)][i6]['money'] != 0 && new_matrix[i6][i6]['money'] > this.matrix[index_finder(from)][i6]['money']) this.arbitrage.add(String(new_matrix[i6][i6]['money'])+'+'+new_matrix[i6][i6]['path'].join('=>'));
                            new_matrix[i6][i6]['money'] = 0;
                            new_matrix[i6][i6]['path'] = [];
                            new_matrix[i6][i6]['slippage'] = 1;
                        }
                    }
                }
            }
            if(JSON.stringify(new_matrix) == JSON.stringify(this.matrix)) {
                // console.log(t1);
                break;
            }
            var temp = this.matrix;
            this.matrix = new_matrix;
            new_matrix = temp;
        }
        // console.log("ARBITRAGE: "+JSON.stringify(this.arbitrage));
    }
    print(){
        for(var i7=0; i7<this.size; i7++){
            for(var j7=0; j7<this.size; j7++){
                console.log(this.currency_list[i7]+'=>'+this.currency_list[j7]+':'+this.matrix[i7][j7]['path']+this.matrix[i7][j7]['money']);
            }
            console.log('\n');
        }
    }
}

module.exports = {
    Math, safemath, CurrencyLists, MATRIX_SIZE,
    Swap,
    Route_Matrix,
    SwapMatrix,
    index_finder
}