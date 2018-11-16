const cv = require('opencv4nodejs');
const fs = require('fs');
const math = require('mathjs');
const F = require('./psf2P.js');
const tm = require('./timer.js');
const D = require('./dots.js');
const ps = require('./matrixParseInt.js');

if(process.argv.length < 5){
	console.log('error: not found argv'+process.argv.length+'\nnode F <input image path> <psf.json> <output image path>');
	process.exit(1);
}
const argv = process.argv;

const img = cv.imread(argv[2], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(argv[3], 'utf8'));

const out_path = argv[4]

// psf inverse
const P = F.psf2P(psf, img.sizes);

const P_inv = math.transpose(tm.timer(() => math.inv(P)));

const img_array = img.getDataAsArray();
const img_array_vec = img_array.reduce((pre, cur) => {pre.push(...cur); return pre;}, []);

const img_org_array_vec = ps.parseUInt8(tm.timer(() => D.dots(P_inv, img_array_vec)));

const img_org_array = Array.from(new Array(img.rows)).map((v, i) => img_org_array_vec.slice(i*img.cols, (i+1)*img.cols));

const img_org = new cv.Mat(img_org_array, cv.CV_8UC1);

cv.imwrite(out_path, img_org);
