async function cal(tocal) {
  if (Number.isInteger(tocal)) {
    console.log("is int")
    return [tocal, 0]
  }
  else {
    let num = tocal;
    let numToString = num.toString();
    let mul = (numToString.length - 1) - numToString.indexOf('.', 0);
    console.log(mul);
    // let seriesOfzero = '0';
    // for (let i = 0; i < mul - 1; i++) {
    //   seriesOfzero = seriesOfzero + '0';
    // }
    // console.log(seriesOfzero);
    let res = numToString.replace('.', '');
    // console.log(res);
    // console.log(res + seriesOfzero);
    console.log("at cal res :" + res)
    return [res, mul];
  }
}
  // cal();

module.exports = {
  cal
}