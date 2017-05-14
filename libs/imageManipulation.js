let Jimp = require('jimp');
let debug = require('debug')('app:imageManipulation');

function resize(path, postfix, width, height) {
	return Jimp.read(path).then((image) => {
		image.resize(width, height) // resize
			.write(path + postfix + '.png'); // save
	}).catch((err) => {
		throw err;
	});
}

module.exports = {
	resize
};