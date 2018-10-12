const cv = require('opencv4nodejs');
const N = 3;
const n = parseInt((N-1)/2);

if(process.argv.length < 2){
	console.log('error: not found argv1');
	process.exit(1);
}

var pse;
eval('pse = '+process.argv[3]);
// console.log(pse[0]);
if(pse === undefined || pse.length != pse[0].length)
	process.exit(0);

const image = cv.imread(process.argv[2], cv.CV_8UC1);

// const pse = Array.from(new Array(N)).map(() => Array.from(new Array(N)).map(() => 1/(N*N)));
// const pse = Array.from(new Array(N)).map(() => Array.from(new Array(N)).map((v, i) => i==n?1/N:0));

const start = Date.now();
const image_noise_array = image.getDataAsArray().map((v, i, a) => v.map((v, j) => {
	var sum = 0.0;
	const i_org = i, j_org = j;
	var i_ = 0;
	for(i-=n; i_ < N; i_++, i++){
		var j_ = 0;
		for(j-=n; j_ < N; j_++, j++){
			sum += (i < 0 || i >= a.length || j < 0 || j >= a[0].length)?0:a[i][j]*pse[i_][j_];
		}
	}
	i = i_org;
	j = j_org;
	return parseInt(sum);
}));
const end = Date.now();

console.log((end - start)+'ms');

const image_noise = new cv.Mat(image_noise_array, cv.CV_8UC1);

cv.imwrite('outImage/C-1-out.png', image_noise);

cv.imshow('noise image', image_noise);
cv.waitKey();
