const cv = require('opencv4nodejs');

const image = cv.imread(process.argv[2]+'.pgm');

cv.imwrite(process.argv[2]+'.png', image);
