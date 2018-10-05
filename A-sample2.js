const cv = require('opencv4nodejs');

const lena = cv.imread('image/lena.pgm', cv.CV_8UC1);
const mask = cv.imread('image/mask.pgm', cv.CV_8UC1);

const mask_array = mask.getDataAsArray();
var min = mask_array[0][0];
var max = min;
const out_array = lena.getDataAsArray().map((v, i) =>
	v.map((v, j) => {
		var val = v + mask_array[i][j];
		if(val < min) min = val;
		if(val > max) max = val;
		return val;
	})
);
console.log(min,max);
const out = new cv.Mat(out_array.map(v => v.map(v => parseInt((v-min)*255/(max-min)))), cv.CV_8UC1);

cv.imwrite('outImage/out2.png', out);

cv.imshow('out', out);
cv.waitKey();
