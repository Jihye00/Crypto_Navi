const test = require('./Data/test_v3.js');
const type = require('./Algorithm/type_v3.js');

var data;
async function main(tokenA, tokenB){
    await test.test();
    var route_matrix = new type.Route_Matrix(type.CurrencyLists);
    // console.log(type.SwapMatrix);
    route_matrix.calc(20, tokenA, 10000000);
    var indexA = type.index_finder(tokenA);
    var indexB = type.index_finder(tokenB);
    data = route_matrix.matrix[indexA][indexB];
    data['slippage'] = 100 * (1 - data['slippage'])
}
async function e () {
    // const start = Date.now();
    await main('KWBTC', 'SIX');
    console.log(data)
    // console.log((Date.now() - start)/1000 + 'sec');
}

e()