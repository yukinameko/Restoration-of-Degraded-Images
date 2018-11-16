const cv = require('opencv4nodejs');
const fs = require('fs');
const F = require('./psf2P.js');

if(process.argv.length < 4){
	console.log('error: not found argv'+process.argv.length+'\nnode D <image path> <psf.json path>');
	process.exit(1);
}

const img = cv.imread(process.argv[2], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));

const img_array = img.getDataAsArray();
const img_array_vec = img_array.reduce((pre, cur) => {pre.push(...cur); return pre;}, []);
const img_vec = new cv.Mat([img_array_vec], cv.CV_32FC1);

const P = F.psf2P(psf, img.sizes);

const start = Date.now();
const img_noise_array_vec = Array.from(new Array(img.rows*img.cols)).map((v, i) => {
	if(i%100 == 0)console.log(i);
	return parseInt(img_array_vec.reduce((pre, cur, j) => pre+cur*P.at(i, j), 0));
	});
const end = Date.now();
console.log((end - start)+'ms');

const img_noise_array = Array.from(new Array(img.rows)).map((v, i) => img_noise_array_vec.slice(i*img.cols, (i+1)*img.cols));

const img_noise = new cv.Mat(img_noise_array, cv.CV_8UC1);

cv.imwrite('outImage/D.png', img_noise);

cv.imshow('test', img_noise);
cv.waitKey();
