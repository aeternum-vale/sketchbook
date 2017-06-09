let Jimp = require('jimp');
let debug = require('debug')('app:imageManipulation');
let InvalidImage = require('error').InvalidImage;

function resize(path, newPath, size, quality) {

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
			image.quality(quality || 75);

			image.write(newPath, err => {
				if (err) reject(err);
				resolve();
			});

		});
	}).catch(err => {
		if (err instanceof InvalidImage)
			throw err;
		else
			throw new InvalidImage();
	});
}

function copy(path, newPath, mw, mh) {
	return Jimp.read(path).then(image => {
		return new Promise((resolve, reject) => {

			if (mw && mh && (image.bitmap.width < mw || image.bitmap.height < mh))
				throw new InvalidImage(`Image must be at least ${mw}px width and ${mh}px height`);

			image.write(newPath, err => {
				if (err) reject(err);
				resolve();
			});
		})
	}).catch(err => {
		if (err instanceof InvalidImage)
			throw err;
		else
			throw new InvalidImage();
	});;
}

function checkSize() {

}

module.exports = {
	resize,
	copy,
	checkSize
};