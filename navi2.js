const test = require('./Data/test2.js');
const type = require('./Algorithm/type.js');
const graph = require('./Algorithm/graphinit_cycle.js');

async function main(){
    var array = await test.test();
    var klayswap = array[0], definix = array[1];
    // console.log(klayswap);
    graph.graph(klayswap, definix);
}

main();