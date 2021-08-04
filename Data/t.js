function rshift (stringint, howmany) {
    let origin = stringint.indexOf('.');
    if (stringint.length - origin > howmany){
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0'));
        console.log(origin);
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0').substring(0, origin + howmany))
        return stringint.replace('.', '').padEnd(howmany+origin, '0').substring(0, origin + howmany)
    }
    else {
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0'));
        return stringint.replace('.', '').padEnd(howmany+origin, '0')
    }
}

function lshift (stringint, howmany) {
    let origin = stringint.indexOf('.');
    if (origin > howmany){
        // console.log(stringint.replace('.', '').padEnd(howmany+origin, '0'));
        console.log(origin);
        // console.log(stringint.replace('.', '').padEnd(howmany+origin, '0').substring(0, origin + howmany))
        console.log("0." + stringint.replace('.', '').padStart(howmany+origin, '0').substring(0, stringint.length + howmany - origin))
        return "0." + stringint.replace('.', '').padStart(howmany+origin, '0').substring(0, stringint.length + howmany - origin)
    }
    else {
        console.log(stringint.replace('.', '').padEnd(howmany+origin, '0'));
        return stringint.replace('.', '').padEnd(howmany+origin, '0')
    }
}
var a = "1.23456789"

lshift("54321.12345", 3);

