//TODO: safemath to regular operation
const Math = require("mathjs");
const safemath = require("safemath");
// constant variables
const dex = [
    'KLAYSWAP',
    'DEFINIX'];
const KLAYSWAP_FEE = 0.003;
const DEFINIX_FEE = 0.002;
const CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC', 'FINIX'];
const MATRIX_SIZE = CurrencyLists.length;
const LAYER = 1; // If the route is this percent better than previous one, change.
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
                this.k1 = x*y;
                if(dex == 'KLAYSWAP') this.fee1 = 1 - KLAYSWAP_FEE;
                else this.fee1 = 1 - DEFINIX_FEE;
                this.num++;
                break;
            case 1:
                if(this.dex1 == dex){
                    this.update_ele(dex, x, y);
                    return;
                }
                else if(this.y1/this.x1 > y/x){
                    this.dex2 = dex;
                    this.x2 = x;
                    this.y2 = y;
                    this.k2 = x*y;
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
                this.limitone = (Math.sqrt(this.k1 * this.x2 / this.y2) - this.x1) / this.fee1;
                this.num++;
                break;
            default:
                this.update_ele(dex, x, y);
                this.limitone = (Math.sqrt(this.k1 * this.x2 / this.y2) - this.x1) / this.fee1;
        }
    }
    update_ele(dex, x, y){
        if(this.num == 1){
            this.x1 = x;
            this.y1 = y;
            this.k1 = x * y;
        }
        else if(dex == this.dex1){
            if(y / x > this.y2 / this.x2){
                this.x1 = x;
                this.y1 = y;
                this.k1 = x * y;
            }
            else{
                this.x1 = this.x2;
                this.y1 = this.y2;
                this.k1 = this.k2;
                this.x2 = x;
                this.y2 = y;
                this.k2 = x * y;
                var temp3 = this.fee1;
                this.fee1 = this.fee2;
                this.fee2 = temp3;
                temp3 = this.dex1;
                this.dex1 = this.dex2;
                this.dex2 = temp3;
            }
        }
        else{
            if(this.y1/this.x1 > y/x){
                this.x2 = x;
                this.y2 = y;
                this.k2 = x * y;
            }
            else{
                this.x2 = this.x1;
                this.y2 = this.y1;
                this.k2 = this.k1;
                this.x1 = x;
                this.y1 = y;
                this.k1 =x * y;
                var temp3 = this.fee2;
                this.fee2 = this.fee1;
                this.fee1 = temp3;
                temp3 = this.dex2;
                this.dex2 = this.dex1;
                this.dex1 = temp3;
            }
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
            const b = this.y1 - this.k1/(this.x1 + a * this.fee1);
            if(a*b == 0){
                return {'KLAYSWAP':[0, 0], 'DEFINIX':[0, 0], 'slippage':1};
            }
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a, b];
                result['DEFINIX'] = [0, 0];
            }
            else{
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [a, b];
            }
            result['slippage'] = ((this.y1-b)/(this.x1+a))/(this.y1/this.x1);
        }
        else{
            const a1 = (Math.sqrt(this.k1)*(this.x2+a*this.fee2)-Math.sqrt(this.k2)*this.x1)/(Math.sqrt(this.k1)*this.fee2+Math.sqrt(this.k2)*this.fee1);
            const a2 = a - a1;
            const b1 = this.y1 - this.k1/(this.x1 + a1 * this.fee1);
            const b2 = this.y2 - this.k2/(this.x2 + a2 * this.fee2);
            const dex1 = this.dex1;
            if(dex1 == 'KLAYSWAP'){
                result['KLAYSWAP'] = [a1, b1];
                result['DEFINIX'] = [a2, b2];
            }
            else {
                result['DEFINIX'] = [a1, b1];
                result['KLAYSWAP'] = [a2, b2];
            }
            if(a > (this.x1+this.x2) || a1 < 0 || a2 < 0){
                result['KLAYSWAP'] = [0, 0];
                result['DEFINIX'] = [0, 0];
            }
            result['slippage'] = ((b1+b2)/(a1*this.fee1+a2*this.fee2)) / (((this.y1/this.x1)*a1+(this.y2/this.x2)*a2)/(a1+a2));
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
    return MATRIX_SIZE + 1;
}

class Route_Row{
    constructor(currency_list, from){
        this.currency_list = currency_list.slice();
        this.row = [];
        this.from_idx = index_finder(from);
        this.size = currency_list.length;
        for(var i2=0; i2<this.size; i2++){
            this.row.push({'money' : 0, 'path' : [], 'slippage' : 1});
        }
    }
    copy(){
        return new Route_Row(this.currency_list);
    }
    calc_init(a){
        for(var j2 = 0; j2 < this.size; j2++){
            if(this.from_idx == j2) {
                this.row[j2]['money'] = a;
                this.row[j2]['slippage'] = 1;
                continue;
            }
            var ratio = SwapMatrix[this.from_idx][j2].ratio(a);
            this.row[j2]['money'] = ratio['KLAYSWAP'][1] + ratio['DEFINIX'][1];
            if(this.row[j2]['money'] > 0) this.row[j2]['path'] = [this.currency_list[this.from_idx]+','+this.currency_list[j2]+',KLAYSWAP,'+String(ratio['KLAYSWAP'][0])+',DEFINIX,'+String(ratio['DEFINIX'][0])];
            this.row[j2]['slippage'] = ratio['slippage'];
        }
    }
    safeconcat(path1, k){
        var str = path1[path1.length - 1].split(',');
        var i4 = index_finder(str[0]);
        var j4 = index_finder(str[1]);
        for(var a=0; a<path1.length; a++){
            var t_str = path1[a].split(',');
            if(t_str[0] == this.currency_list[k]){
                return [null, -1, 0];
            }
        }
        var k_money = Number(str[3]);
        var d_money = Number(str[5]);
        var ratio1 = SwapMatrix[i4][j4].ratio(k_money + d_money);
        var money = ratio1['KLAYSWAP'][1] + ratio1['DEFINIX'][1];
        var ratio2 = SwapMatrix[j4][k].ratio(money);
        var new_path = path1.slice();
        new_path.push(this.currency_list[j4]+','+this.currency_list[k]+',KLAYSWAP,'+String(ratio2['KLAYSWAP'][0])+',DEFINIX,'+String(ratio2['DEFINIX'][0]));
        money = ratio2['KLAYSWAP'][1] + ratio2['DEFINIX'][1];
        var mul_slippage = ratio1['slippage'] * ratio2['slippage'];
        return [new_path, money, mul_slippage];
    }
    calc(T, a){
        this.calc_init(a);
        var new_row = [];
        for(var i5=0; i5<this.size; i5++){
            new_row.push({'money' : 0, 'path' : [], 'slippage' : 1});
        }
        for(var t1=0; t1<T; t1++){
            for(var i6=0; i6<this.size; i6++){
                for(var j6=0; j6<this.size; j6++){
                    if(i6 == j6 || this.row[i6]['path'].length == 0) continue;
                    var cycle_removed = this.safeconcat(this.row[i6]['path'], j6);
                    const max_val = Math.max(new_row[j6]['money'], this.row[j6]['money'], cycle_removed[1]*LAYER);
                    switch(max_val){
                        case this.row[j6]['money']:
                            new_row[j6]['money'] = this.row[j6]['money'];
                            new_row[j6]['path'] = JSON.parse(JSON.stringify(this.row[j6]['path']));
                            new_row[j6]['slippage'] = this.row[j6]['slippage'];
                            break;
                        case cycle_removed[1]*LAYER:
                            new_row[j6]['path'] = cycle_removed[0];
                            new_row[j6]['money'] = cycle_removed[1];
                            new_row[j6]['slippage'] = cycle_removed[2];
                    }
                }
            }
            if(JSON.stringify(new_row) == JSON.stringify(this.row)) {
                console.log(t1);
                break;
            }
            var temp = this.row;
            this.row = new_row;
            new_row = temp;
        }
    }
    print(){
        for(var i7=0; i7<this.size; i7++){
            console.log(this.currency_list[i7], ':', this.row[i7]['path'], this.row[i7]['money'], 'slippage:', this.row[i7]['slippage']);
            console.log('\n');
        }
    }
}

module.exports = {
    Math, safemath, CurrencyLists, MATRIX_SIZE,
    Swap,
    Route_Row,
    SwapMatrix,
    index_finder
}
