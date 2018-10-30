const cv = require('opencv4nodejs');

if(process.argv.length < 4){
	console.log('error: not found argv'+(process.argv.length));
	process.exit(1);
}

const path = process.argv[2];
const size = process.argv[3]|0;

const image = cv.imread(path, cv.CV_8UC1);

const image_resize = image.resize(size, size);

const path_resize = path.slice(0, -4) + '_resize'+size+'.png';

cv.imwrite(path_resize, image_resize);
