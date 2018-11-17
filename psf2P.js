exports.psf2P = function(psf, sizes){
	const start = Date.now();
	const rows = sizes[0];
	const cols = sizes[1];
	const N = psf.length;
	const n = parseInt((N-1)/2);
	const P = Array.from(new Array(rows*cols)).map(v => (new Array(rows*cols)).fill(0));
	for(var row = 0; row < rows; row++){
		for(var col = 0; col < cols; col++){
			var i = row - n;
			var i_ = 0;
			while(i_<N){
				if(!(i < 0 || i >= rows)){
					var j_ = 0;
					var j = col - n;
					while(j_<N){
						if(!(j < 0 || j >= cols))
							P[row*cols+col][i*cols+j] = psf[i_][j_];
						j++; j_++;
					}
				}
				i++; i_++;
			}
		}
	}
	const end = Date.now();
	console.log((end - start)+'ms');
	return P;
}