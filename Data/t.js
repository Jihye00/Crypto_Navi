async function lshift (stringint, howmany) {
    let origin = stringint.indexOf('.');
    if (origin == -1) stringint = stringint+'.';
    origin = stringint.indexOf('.');
    // console.log(origin)
    // console.log(stringint, howmany, origin)
    var zeros = []
    for (i = 0; i < Math.abs(howmany); i++) zeros.push('0');
    // if (origin >= howmany){
        // console.log(stringint.replace('.', '').padEnd(howmany+origin, ‘0’));
    var temp = zeros.concat(stringint.split('')).concat(zeros)
    // console.log(temp)
    var neworigin = temp.indexOf('.')
    temp.splice(neworigin, 1)
    // console.log(temp)
    // console.log(temp)
    // temp.splice(neworigin + howmany)
    // console.log(temp)\
    if (howmany > 0) {
        temp.splice(neworigin - howmany, 0, '.')
        temp.splice(temp.indexOf('.')+ Math.abs(howmany) + 1)
        // console.log(temp.join(''))
        return temp.join('');
    }
    else {
        temp.splice(neworigin - howmany, 0, '.')
        temp.splice(temp.indexOf('.'))
        // console.log(temp.join(''))
        return temp.join('');
    }
        // console.log(stringint.replace(‘.’, '').padEnd(howmany+origin, ‘0’).substring(0, origin + howmany))
        // console.log(“0.” + stringint.replace(‘.’, '').padStart(howmany+origin, ‘0’).substring(0, stringint.length + howmany - origin))
        // console.log(‘11111’)
        // return “0.” + stringint.replace(‘.’, '').padStart(howmany+origin, ‘0’).substring(0, stringint.length + howmany - origin)
    // }
    // else {
    //     console.log(stringint.replace(‘.’, '').padEnd(howmany+origin, ‘0’));
    //     console.log(‘22222’)
    //     return stringint.replace(‘.’, '').padEnd(howmany+origin, ‘0’)
    // }
}
// var a = “1.23456789”
module.exports = {
    // rshift,
    lshift
}
// console.log(lshift(“000000000000000000391369877158.080000000000000000", 18))
// console.log(lshift(“105274”, 6))
// // console.log(lshift(“0.12345", 2))
// // console.log(lshift(“0.00001”, 2))
// 00000.000000054321
// 54321098765432100
// 0.000000054321
// 54321098765432100.0000000000