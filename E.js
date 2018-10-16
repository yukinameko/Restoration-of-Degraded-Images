const cv = require('opencv4nodejs');
const fs = require('fs');

if(process.argv.length < 6){
	console.log('error: not found argv'+process.argv.length+'\nnode E <input image path> <psf.json> <bit> <output image path>');
	process.exit(1);
}
const argv = process.argv;

const image = cv.imread(argv[2], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(argv[3], 'utf8'));

const bit_num = argv[4]|0;
if(bit_num <= 0 || bit_num > 7)process.exit(1);

const out_name = argv[5];

const N = psf.length;
const n = parseInt((N-1)/2);

const bit = parseInt(Array.from(new Array(8)).reduce((pre, cur, i) => ((i<bit_num)?'0':'1')+pre, ''), 2);

const start = Date.now();
const image_noise_array = image.getDataAsArray().map((v, io, a) => v.map((v, jo) => {
	var sum = 0.0;
	var i = io - n;
	var i_ = 0;
	while(i_<N){
		if(!(i < 0 || i >= a.length)){
			var j_ = 0;
			var j = jo - n;
			while(j_<N){
				sum += (j < 0 || j >= a[0].length)?0:(a[i][j]*psf[i_][j_]);
				j++; j_++;
			}
		}
		i++; i_++;
	}

	return parseInt(sum) & bit;
}));
const end = Date.now();

console.log((end - start)+'ms');

const image_noise = new cv.Mat(image_noise_array, cv.CV_8UC1);

cv.imwrite('outImage/'+out_name, image_noise);

cv.imshow('noise image', image_noise);
cv.waitKey();
