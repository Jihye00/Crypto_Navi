const test = require('./Data/test2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_cycle.js');

async function main(request){
    var array = await test.test();
    var klayswap = array[0], definix = array[1];
    // console.log(klayswap);
    var matrix = await graph.graph(klayswap, definix);
    console.log(request)
    // console.log(JSON.stringify(matrix))
    for (i = 0; i < request.length; i++){
        var indexA = type.CurrencyLists.indexOf(request[i][0]);
        var indexB = type.CurrencyLists.indexOf(request[i][1]);
        console.log('routing from ' + request[i][0] +' to ' + request[i][1]);
        console.log(matrix[indexA][indexB].path + matrix[indexA][indexB].ratio.toString().padStart(20));
    }
}
// const CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp
let requests = [['KLAY','KUSDT'],['KBNB','KUSDT'],['KETH','KUSDT'],['KBNB','KETH'],['KORC','KUSDT']];
main(requests);

