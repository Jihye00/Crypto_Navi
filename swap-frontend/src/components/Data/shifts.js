const big = require('bignumber.js');

async function lshift(stringint, howmany) {
	if (stringint.indexOf('.') == -1) stringint = stringint + '.';
	let origin = stringint.indexOf('.');

	let zeros = [];
	for (var i = 0; i < Math.abs(howmany); i++) zeros.push('0');
	let temp = zeros.concat(stringint.split('')).concat(zeros);
	let neworigin = temp.indexOf('.');
	temp.splice(neworigin, 1);
	// small unit to large unit (peb => KLAY)
	if (howmany > 0) {
		temp.splice(neworigin - howmany, 0, '.');
		temp.splice(temp.indexOf('.') + Math.abs(howmany) + 1);
		// return big.BigNumber(temp.join(''));
		return temp.join('');
	}
	// large unit to small unit (KLAY => peb)
	else {
		temp.splice(neworigin - howmany, 0, '.');
		temp.splice(temp.indexOf('.'));
		// return big.BigNumber(temp.join(''));
		return temp.join('');
	}
}
module.exports = {
	lshift,
};

// bignumber
