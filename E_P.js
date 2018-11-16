const cv = require('opencv4nodejs');
const fs = require('fs');
const F = require('./psf2P.js');
const tm = require('./timer.js');
const D = require('./dots.js');

if(process.argv.length < 6){
	console.log('error: not found argv'+process.argv.length+'\nnode E <input image path> <psf.json> <bit> <output image path>');
	process.exit(1);
}
const argv = process.argv;

const image = cv.imread(argv[2], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(argv[3], 'utf8'));

const bit_num = argv[4]|0;
if(bit_num < 0 || bit_num > 7)process.exit(1);

const out_name = argv[5];

const N = psf.length;
const n = parseInt((N-1)/2);

const bit = parseInt(Array.from(new Array(8)).reduce((pre, cur, i) => ((i<bit_num)?'0':'1')+pre, ''), 2);

const P = F.psf2P(psf, image.sizes);

const img_array = image.getDataAsArray();
const img_array_vec = img_array.reduce((pre, cur) => {pre.push(...cur); return pre;}, []);

const start = Date.now();
const img_noise_vec = D.dots(P, img_array_vec);
const end = Date.now();
console.log((end - start)+'ms');

const img_noise_array = Array.from(new Array(image.rows)).map((v, i) => img_noise_vec.slice(i*image.cols, (i+1)*image.cols));

const image_noise = new cv.Mat(img_noise_array, cv.CV_8UC1);

cv.imwrite('outImage/'+out_name, image_noise);

cv.imshow('noise image', image_noise);
cv.waitKey();
