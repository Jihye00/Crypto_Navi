const type = require('./Algorithm/type.js');
const DUMMY_RATIO = -1;
const DUMMY_DEX = 'not available';

var CurrencyLists = ['KLAY', 'KBNB', 'KUSDT', 'KDAI', 'KXRP', 'KETH', 'KSP', 'SIX', 'KORC', 'KWBTC']; // xrp, btc, six, ksp

// function safeconcat (swapa, swapb) {
//     if (JSON.stringify(swapa.path).includes(JSON.stringify(swapb.path))) {
//         console.log("cycle");
//         return JSON.parse(JSON.stringify(swapa.path));
//     }
//     else {
//         a = JSON.parse(JSON.stringify(swapa.path.concat(JSON.parse(JSON.stringify(swapb.path)))));
//         console.log("no cycle");
//         return a;
//     }
// }
function safeconcat (swapa = new type.Swap(), swapb = new type.Swap()) {
    let new_path = []
    new_path = JSON.parse(JSON.stringify(swapa.path.concat((swapb.path))));
    // console.log(new_path);
    // console.log(new_path);
    return new_path.filter((item,index)=>{
        return (new_path.indexOf(item) == index)
    })
}

// let d = []
// for (i = 0; i < 3; i++) {
//     for (j = 0; j < 3; j++) {
//         d.push(new type.Swap(CurrencyLists[i], CurrencyLists[j]))
        
//     }
// }
// console.log(d);
// console.log(JSON.stringify(d, null, 2));
// d[1].path = safeconcat(d[1], d[1]);
// d[2].path = safeconcat(d[2], d[1]);
// d[1].path = safeconcat(d[1], d[2]);
// d[1].path = safeconcat(d[1], d[2]);
// d[2].path = safeconcat(d[2], d[1]);

// // console.log(d);
// console.log(JSON.stringify(d, null, 2));
// console.log(d[1].path)


module.exports = {
    safeconcat
}