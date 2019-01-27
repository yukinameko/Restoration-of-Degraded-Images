const D = require('./dots.js').dots;
const math = require('mathjs');

exports.inv = res => {
	const Sinv = res.S.map(v => 1/v);
	const VS = math.transpose(res.V).map((v,j) => v.map((v, i) => v*Sinv[i]));
	return D(VS, math.transpose(res.U));
}
