var path = require('path');
var util = require('util');
var http = require('http');


function CustomError(message) {
	this.name = "CustomError";
	this.message = message;

	if (Error.captureStackTrace) {
		Error.captureStackTrace(this, CustomError);
	} else {
		this.stack = (new Error()).stack;
	}
}
util.inherits(CustomError, Error);
CustomError.prototype.constructor = CustomError;


function LoginError(message) {
	CustomError.call(this, message);
	this.name = "LoginError";
}
util.inherits(LoginError, CustomError);
LoginError.prototype.constructor = LoginError;


function PropertyError(property, message) {
	CustomError.call(this, message);
	this.name = "PropertyError";
	this.property = property;
}
util.inherits(PropertyError, CustomError);
PropertyError.prototype.constructor = PropertyError;


function DuplicatingUniquePropertyError(property, message) {
	PropertyError.call(this, property, message);
	this.name = "DuplicatingUniquePropertyError";
}
util.inherits(DuplicatingUniquePropertyError, PropertyError);
DuplicatingUniquePropertyError.prototype.constructor = DuplicatingUniquePropertyError;


function HttpError(status, message) {
	CustomError.call(this, "Not found")
	this.name = "HttpError";

	this.status = status;
	this.message = message || http.STATUS_CODES[status] || "Error";
}
util.inherits(HttpError, CustomError);
HttpError.prototype.constructor = HttpError;


function InvalidImage(error, message) {
	CustomError.call(this, message || "Invalid Image")
	this.name = "InvalidImage";
	this.error = error;
}
util.inherits(InvalidImage, CustomError);
InvalidImage.prototype.constructor = InvalidImage;


module.exports = {
	HttpError,
	PropertyError,
	DuplicatingUniquePropertyError,
	LoginError,
	InvalidImage
};