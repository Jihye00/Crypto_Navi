const type = require('./Algorithm/type.js');

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

module.exports = {
    safeconcat
}