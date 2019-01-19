const math = require('mathjs');

function dot(A, b) {
	const rows = b.length;
	return Array.from(new Array(rows)).map((v, i) =>
		A[i].reduce((pre, cur, j) => pre+cur*b[j], 0)
	);
}

var operator = {
	'+':(A,B) => {
		return A.map((v,i) => v.map((v,j) => v+B[i][j]));
	},
	'-':(A,B) => {
		return A.map((v,i) => v.map((v,j) => v-B[i][j]));
	},
	'*':(A,B) => {
		const A_ = math.transpose(A);
		if(B[0].length == undefined)
			return dot(A_, B); 
		return B.map((v, i) => dot(A_, v));
	}
}

exports.mat = (A, op, B) => {
	return operator[op](A,B);
}