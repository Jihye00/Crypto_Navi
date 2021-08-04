const test = require('./Data/test_v3.js');
const type = require('./Algorithm/type_v3.js');

var data;
async function main(tokenA, tokenB){
    await test.test();
    var route_matrix = new type.Route_Matrix(type.CurrencyLists);
    // console.log(type.SwapMatrix);
    route_matrix.calc(20, tokenA, 1000);
    var indexA = type.index_finder(tokenA);
    var indexB = type.index_finder(tokenB);
    data = route_matrix.matrix[indexA][indexB];
}
async function e () {
    await main('KLAY', 'KUSDT');
    console.log(data)
}

e()