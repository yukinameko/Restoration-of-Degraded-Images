const fs = require('fs');

const argv = process.argv;

const psf = JSON.parse(fs.readFileSync(argv[2], 'utf8'));

console.log(psf.reduce((pre, cur) => pre+cur.reduce((pre, cur) => pre+cur, 0), 0));