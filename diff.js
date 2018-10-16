const cv = require('opencv4nodejs');
const fs = require('fs');

if(process.argv.length < 4){
	console.log('error: not found argv1');
	process.exit(1);
}

const img1 = cv.imread(process.argv[2], cv.CV_8UC1);
const img2 = cv.imread(process.argv[3], cv.CV_8UC1);

if(img1.sizes.toString() != img2.sizes.toString()){
	console.log('error: size is different');
	process.exit(1);
}

console.log(img1.getDataAsArray().toString() == img2.getDataAsArray().toString());