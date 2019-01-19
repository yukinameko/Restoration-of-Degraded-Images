const math = require('mathjs');

exports.dots = (A, B) => {
	function dot(A, b) {
		const rows = b.length;
		return Array.from(new Array(rows)).map((v, i) =>
			A[i].reduce((pre, cur, j) => pre+cur*b[j], 0)
		);
	}
	const A_ = math.transpose(A)
	if(B[0].length == undefined)
		return dot(A_, B); 
	return B.map((v, i) => dot(A_, v));
}