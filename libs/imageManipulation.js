let Jimp = require('jimp');
let debug = require('debug')('app:imageManipulation');

function resize(path, postfix, size) {

	return Jimp.read(path).then((image) => {
		return new Promise((resolve, reject) => {
			if (image.bitmap.width > image.bitmap.height) {
				image.resize(Jimp.AUTO, size);
				image.crop(image.bitmap.width / 2 - size / 2, 0, size, size);
			} else {
				image.resize(size, Jimp.AUTO);
				image.crop(0, image.bitmap.height / 2 - size / 2, size, size);
			}

			image.write(path + postfix, (err) => {
				if (err) reject(err);
				resolve();
			});
			
		});
	}).catch((err) => {
		throw err;
	});
}

module.exports = {
	resize
};