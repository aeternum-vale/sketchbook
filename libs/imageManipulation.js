let Jimp = require('jimp');
let debug = require('debug')('app:imageManipulation');
let InvalidImage = require('error').InvalidImage;

function resize(path, newPath, size) {

	return Jimp.read(path).then(image => {
		return new Promise((resolve, reject) => {

			if (image.bitmap.width > image.bitmap.height) {
				image.resize(Jimp.AUTO, size);
				image.crop(image.bitmap.width / 2 - size / 2, 0, size, size);
			} else {
				image.resize(size, Jimp.AUTO);
				image.crop(0, image.bitmap.height / 2 - size / 2, size, size);
			}

			image.rgba(false);
			image.quality(50);

			image.write(newPath, err => {
				if (err) reject(err);
				resolve();
			});

		});
	}).catch(err => {
		throw new InvalidImage(err);
	});
}

function copy(path, newPath) {
	return Jimp.read(path).then(image => {
		return new Promise((resolve, reject) => {
			image.write(newPath, err => {
				if (err) reject(err);
				resolve();
			});
		})
	}).catch(err => {
		throw new InvalidImage(err);
	});;
}

function checkSize() {

}

module.exports = {
	resize,
	copy,
	checkSize
};