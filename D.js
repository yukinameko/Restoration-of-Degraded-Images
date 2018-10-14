const cv = require('opencv4nodejs');

const img = cv.imread('image/lena.pgm', cv.CV_8UC1);

const im = new cv.Mat([img.getDataAsArray()[0]], cv.CV_8UC1);

cv.imshow('test', im);
cv.waitKey();