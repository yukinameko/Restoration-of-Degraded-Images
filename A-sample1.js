const cv = require('opencv4nodejs');

const lena = cv.imread('image/lena.pgm', cv.CV_8UC1);
const mask = cv.imread('image/mask.pgm', cv.CV_8UC1);

const mask_array = mask.getDataAsArray();
const out_array = lena.getDataAsArray().map((v, i) =>
	v.map((v, j) => v + mask_array[i][j])
);
const out = new cv.Mat(out_array, cv.CV_8UC1);

cv.imwrite('outImage/out1.png', out);

cv.imshow('out', out);
cv.waitKey();
