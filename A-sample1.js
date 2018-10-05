const cv = require('opencv4nodejs');

const lena = cv.imread('image/lena.pgm');
const mask = cv.imread('image/mask.pgm');

const out = lena.add(mask);

cv.imwrite('outImage/out1.png', out);

cv.imshow('out', out);
cv.waitKey();
