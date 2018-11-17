exports.psf2P = function(c, r, sizes){
	const start = Date.now();
	const rows = sizes[0];
	const cols = sizes[1];
	const Ar = toeplitz(r, cols);
	const Ac = toeplitz(c, rows);
	const end = Date.now();
	console.log((end - start)+'ms');
	return [Ar, Ac];
}

function toeplitz(v, N) {
	const L = v.length;
	const l = parseInt((L-1)/2);
	const A = Array.from(new Array(N*N)).map(v => (new Array(N*N)).fill(0));
	for(var n = 0; n < N; n++){
		for(var i = 0; i < L; i++){
			if(n+i-l >= 0 && n+i-l < N){
				A[n][n+i-l] = v[L-i-1];
			}
		}
	}
	return A;
}