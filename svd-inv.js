const D = require('./dots.js').dots;
const math = require('mathjs');

exports.inv = (res) => {
	const Sinv = res.S.map(v => {1/v});
	const VS = res.V.map(v => v.map((v, i) => v*Sinv[i]));
	return D(VS, math.transpose(res.U));
}
