const cv = require('opencv4nodejs');
const fs = require('fs');
const math = require('mathjs');
const svd = require('node-svd').svd;
const plt = require('matplotnode');

const F = require('./psf2P.js');
const tm = require('./timer.js');
const D = require('./dots.js').dots;
const inv = require('./svd-inv').inv;
const ps = require('./matrixParseInt.js');

if(process.argv.length < 6){
	console.log('error: not found argv'+process.argv.length+'\nnode H <input original-image path> <input noise-image path> <psf.json> <output images name>');
	process.exit(1);
}

const argv = process.argv;

const org = cv.imread(argv[2], cv.CV_8UC1);
const img = cv.imread(argv[3], cv.CV_8UC1);

const psf = JSON.parse(fs.readFileSync(argv[4], 'utf8'));

const out_name = argv[5];

const rows = img.rows;
const cols = img.cols;

// psf inverse
const P = F.psf2P(psf, img.sizes);

let res = svd(P);

const org_array = org.getDataAsArray();
const org_array_vec = org_array.reduce((pre, cur) => {pre.push(...cur); return pre;}, []);

const img_array = img.getDataAsArray();
const img_array_vec = img_array.reduce((pre, cur) => {pre.push(...cur); return pre;}, []);

console.log('start');

const [ts, psnrs, t, psnr, k] = tm.timer(() => {
	const S = res.S;
	let k = S.length-1;
	let k_max = k-1;
	let t_max = 0;
	let psnr_max = 0;
	let psnrs = [];
	const ts = Array.from(new Array(20)).map((v, i) => i/20.0);
	for(const t of ts){
		while(S[k] < t){
			if(k == 0)break;
			k--;
		};

		res.U = res.U.map(v => v.slice(0, k));
		res.V = res.V.slice(0, k);
		res.S = res.S.slice(0, k);

		const P_inv = inv(res);
		img_org_array_vec = ps.parseUInt8(D(P_inv, img_array_vec));
		const psnr = 10*Math.log10(255*255/img_org_array_vec.reduce((pre, cur, i) => 
			pre+(cur-org_array_vec[i])*(cur-org_array_vec[i]),0)*(rows*cols));

		psnrs.push(psnr);
		if(psnr > psnr_max){
			psnr_max = psnr;
			t_max = t;
			k_max = k+1;
		}

		const img_org_array = Array.from(new Array(rows)).map((v, i) => img_org_array_vec.slice(i*cols, (i+1)*cols));
		const img_org = new cv.Mat(img_org_array, cv.CV_8UC1);
		cv.imwrite(`outImage/${out_name}-t${parseInt(t*100)}.png`, img_org);

		// output log
		console.log(`theta=${t} : psnr=${psnr}, k=${k+1}`);
	}
	return [ts, psnrs, t_max, psnr_max, k_max];
});

console.log(`max psnr\ntheta=${t} : psnr=${psnr}, k=${k}`);

plt.plot(ts, psnrs);
plt.xlabel("theta");
plt.ylabel("psnr");
plt.show();
