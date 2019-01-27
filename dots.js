const math = require('mathjs');

exports.dots = (A, B) => {
	function dot(a, B) {
		const rows = a.length;
		return B.map(v => a.reduce((pre, cur, i) => pre+cur*v[i], 0));
	}
	const B_ = math.transpose(B)
	if(B[0].length == undefined)
		return dot(A, [B]); 
	return A.map((v, i) => dot(v, B_));
}
