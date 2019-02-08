const cv = require('opencv4nodejs');
const fs = require('fs');
const math = require('mathjs');
const F = require('./psf2P.js');
const tm = require('./timer.js');
const D = require('./dots.js');
const ps = require('./matrixParseInt.js');

const P2psf = (P, sizes, psfSize) => {
	const rows = sizes[0];
	const cols = sizes[1];
	let N = psfSize;
	if(N > rows || N == 0)N = 2*rows - 1;
	const n = parseInt((N-1)/2);
	const psf = Array.from(new Array(N)).map(v => Array.from(new Array(N)).fill(0));
	const psf_num = Array.from(new Array(N)).map(v => Array.from(new Array(N)).fill(0));

	for(let k=0; k<rows*cols; k++){
		for(let i=0; i<N; i++){
			if(k%cols + i-n < 0 || k%cols + i-n >= cols)continue;
			for(let j=0; j<N; j++){
				if(((k/cols)|0) + j-n < 0 || ((k/cols)|0) + j-n >= cols)continue;
				let pos = k + (j-n)*cols + i-n;
				psf[i][j] += P[k][pos];
				psf_num[i][j]++;
			}
		}
	}
	for(let i=0; i<N; i++){
		for(let j=0; j<N; j++){
			if(psf_num[i][j] != 0)
				psf[i][j] /= psf_num[i][j];
		}
	}
	return psf;
};

if(process.argv.length < 6){
	console.log('error: not found argv'+process.argv.length+'\nnode J <input image path> <psf.json> <output image path> <inv psf size>');
	process.exit(1);
}

const argv = process.argv;

const img = cv.imread(argv[2], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(argv[3], 'utf8'));

const out_path = argv[4];

const N = argv[5]|0;

// psf inverse
const P = F.psf2P(psf, img.sizes);

const P_inv = math.transpose(tm.timer(() => math.inv(P)));

const n = (N-1)/2;
const cols = img.sizes[0];
const rows = img.sizes[1];
const invPsf = P2psf(P_inv, img.sizes, N);

const img_array = img.getDataAsArray();
const im_org_array = img_array.map((v, io, a) => v.map((v, jo) => {
	var sum = 0.0;
	var i = io - n;
	var i_ = 0;
	while(i_<N){
		if(!(i < 0 || i >= a.length)){
			var j_ = 0;
			var j = jo - n;
			while(j_<N){
				sum += (j < 0 || j >= a[0].length)?0:(a[i][j]*invPsf[i_][j_]);
				// sum += (j < 0 || j >= a[0].length)?0:(a[i][j]*P_inv[io*cols+jo][io*cols+jo+j_-n]);
				j++; j_++;
			}
		}
		i++; i_++;
	}

	return (sum<0?0:(sum>255?255:sum))|0;
}));

const im_org = new cv.Mat(im_org_array, cv.CV_8UC1);

cv.imwrite(out_path, im_org);
cv.imshow('test', im_org);
cv.waitKey();
