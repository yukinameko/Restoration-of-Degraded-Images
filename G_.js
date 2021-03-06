const cv = require('opencv4nodejs');
const fs = require('fs');
const math = require('mathjs');
const svd = require('node-svd').svd;

const p2P = require('./psf2P_separable.js');
const D = require('./dots.js').dots;
const inv = require('./svd-inv').inv;
const ps = require('./matrixParseInt.js');

if(process.argv.length < 5){
	console.log('error: not found argv'+process.argv.length+'\nnode G-make <input image path> <psf1.json> <psf2.json> <output noise image path>');
	process.exit(1);
}
const argv = process.argv;

const image = cv.imread(argv[2], cv.CV_8UC1);

const c = JSON.parse(fs.readFileSync(argv[3], 'utf8'));
const r = JSON.parse(fs.readFileSync(argv[4], 'utf8'));

const image_array = image.getDataAsArray();
const [Ac, Ar] = p2P.psf2P(c, r, image.sizes);

const B = D(D(Ac, image_array), math.transpose(Ar));

const resAc = svd(Ac);
const resAr = svd(Ar);

const image_org_array = D(D(inv(resAc), ps.parseUInt8(B)), math.transpose(inv(resAr)));
const image_org_uint_array = ps.parseUInt8(image_org_array);

const image_org_uint = new cv.Mat(image_org_uint_array, cv.CV_8UC1);

cv.imshow('noise', image);
cv.imshow('toeplitz', image_org_uint);
cv.waitKey();
