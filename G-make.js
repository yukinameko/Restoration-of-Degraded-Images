const cv = require('opencv4nodejs');
const fs = require('fs');
const math = require('mathjs');

const p2P = require('./psf2P_separable.js');
const D = require('./dots.js');

if(process.argv.length < 6){
	console.log('error: not found argv'+process.argv.length+'\nnode G <input image path> <psf1.json> <psf2.json> <output image path>');
	process.exit(1);
}
const argv = process.argv;

const image = cv.imread(argv[2], cv.CV_8UC1);

const c = JSON.parse(fs.readFileSync(argv[3], 'utf8'));
const r = JSON.parse(fs.readFileSync(argv[4], 'utf8'));

const out_path = argv[4];

const image_array = image.getDataAsArray();
const [Ac, Ar] = p2P.psf2P(c, r, image.sizes);
console.log(Ac.length, Ac[0].length);
console.log(Ar.length, Ar[0].length);

const B = D.dots(D.dots(Ac, image_array), math.transpose(Ar));

const noise_image = new cv.Mat(B, cv.CV_8UC1);

cv.imwrite('outImage/G-noise.png', noise_image);
