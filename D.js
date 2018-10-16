const cv = require('opencv4nodejs');
const fs = require('fs');

if(process.argv.length < 4){
	console.log('error: not found argv'+process.argv.length+'\nnode D <image path> <psf.json path>');
	process.exit(1);
}

const img = cv.imread(process.argv[2], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

function psf2p(psf, sizes){
	const start = Date.now();
	const rows = sizes[0];
	const cols = sizes[1];
	const N = psf.length;
	const n = parseInt((N-1)/2);
	const P = new cv.Mat(rows*cols, rows*cols, cv.CV_32FC1);
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
							P.set(row*cols+col, i*cols+j, psf[i_][j_]);
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

const img_array = img.getDataAsArray();
const img_array_vec = img_array.reduce((pre, cur) => {pre.push(...cur); return pre;}, []);
const img_vec = new cv.Mat([img_array_vec], cv.CV_32FC1);

const P = psf2p(psf, img.sizes);

// console.log(P.norm(img));
const start = Date.now();
const img_noise_array_vec = Array.from(new Array(img.rows*img.cols)).map((v, i) => {
	if(i%100 == 0)console.log(i);
	return parseInt(img_array_vec.reduce((pre, cur, j) => pre+cur*P.at(i, j), 0));
	});
const end = Date.now();
console.log((end - start)+'ms');

const img_noise_array = Array.from(new Array(img.rows)).map((v, i) => img_noise_array_vec.slice(i*img.cols, (i+1)*img.cols));

const img_noise = new cv.Mat(img_noise_array, cv.CV_8UC1);

// const im = new cv.Mat([img.getDataAsArray()[0]], cv.CV_8UC1);

cv.imwrite('outImage/D.png', img_noise);

cv.imshow('test', img_noise);
cv.waitKey();

// console.log(im.rows);