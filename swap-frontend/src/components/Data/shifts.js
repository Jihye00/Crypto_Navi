async function lshift (stringint, howmany) {
    let origin = stringint.indexOf('.');
    if (origin == -1) stringint = stringint+'.';
    origin = stringint.indexOf('.');
    var zeros = []
    for (i = 0; i < Math.abs(howmany); i++) zeros.push('0');
    var temp = zeros.concat(stringint.split('')).concat(zeros)
    var neworigin = temp.indexOf('.')
    temp.splice(neworigin, 1)

    // small unit to large unit (peb => KLAY)
    if (howmany > 0) {
        temp.splice(neworigin - howmany, 0, '.')
        temp.splice(temp.indexOf('.')+ Math.abs(howmany) + 1)
        return temp.join('');
    }
    // large unit to small unit (KLAY => peb)
    else {
        temp.splice(neworigin - howmany, 0, '.')
        temp.splice(temp.indexOf('.'))
        return temp.join('');
    }
}
module.exports = {
    lshift
}

// bignumber