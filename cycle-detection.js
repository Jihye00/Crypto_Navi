const type = require('./Algorithm/type.js');

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
function safeconcat (swapa, swapb) {
    var new_path = JSON.parse(JSON.stringify(swapa.path));
    new_path = new_path.concat(swapb.path);
    // console.log(new_path);
    var set = new Set(new_path);
    if(set.size == new_path.length)
        return [new_path, type.safemath.safeMule(swapa.ratio, swapb.ratio)];
    else
        return [null, -1];
}

let d = []
for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
        var s = new type.Swap(type.CurrencyLists[i], type.CurrencyLists[j]);
        type.refresh(s);
        d.push(s);
        
    }
}
// console.log(d);
// console.log(JSON.stringify(d, null, 2));
// d[1].path = safeconcat(d[1], d[1]);
// d[2].path = safeconcat(d[2], d[1]);
// d[1].path = safeconcat(d[1], d[2]);
// d[1].path = safeconcat(d[1], d[2]);
// d[2].path = safeconcat(d[2], d[1]);

// // console.log(d);
// console.log(JSON.stringify(d, null, 2));
// console.log(d[2].path)
// console.log(d[1].path)


module.exports = {
    safeconcat
}