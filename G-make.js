const cv = require('opencv4nodejs');
const fs = require('fs');
const math = require('mathjs');

const p2P = require('./psf2P_separable.js');
const D = require('./dots.js');
const ps = require('./matrixParseInt.js');

if(process.argv.length < 6){
	console.log('error: not found argv'+process.argv.length+'\nnode G-make <input image path> <psf1.json> <psf2.json> <output noise image path>');
	process.exit(1);
}
const argv = process.argv;

const image = cv.imread(argv[2], cv.CV_8UC1);

const c = JSON.parse(fs.readFileSync(argv[3], 'utf8'));
const r = JSON.parse(fs.readFileSync(argv[4], 'utf8'));

const out_path = argv[5];

const image_array = image.getDataAsArray();
const [Ac, Ar] = p2P.psf2P(c, r, image.sizes);

const B = D.dots(D.dots(Ac, image_array), math.transpose(Ar));

const noise_image = new cv.Mat(ps.parseUInt8(B), cv.CV_8UC1);

cv.imwrite(out_path, noise_image);
