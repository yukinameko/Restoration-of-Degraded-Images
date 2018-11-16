exports.timer = (callback) => {
	const start = Date.now();
	const hoge = callback();
	const end = Date.now();
	console.log((end - start)+'ms');
	return hoge;
}
