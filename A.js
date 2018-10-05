const cv = require('opencv4nodejs');

const fruits = cv.imread('image/fruits.jpg');

const fruits_gray = fruits.bgrToGray();

const fruits_canny = fruits_gray.canny(50, 150);

const fruits_cubic = fruits.resize(fruits.rows*1.5, fruits.cols*1.5, interpolation=cv.INTER_CUBIC);

cv.imshow('original', fruits);
cv.imshow('gray', fruits_gray);
cv.imshow('canny', fruits_canny);
cv.imshow('cubic', fruits_cubic);
cv.waitKey();

cv.imwrite('outImage/fruits_cubic.png', fruits_cubic);
