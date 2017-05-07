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


function PropertyError(property, message) {
	CustomError.call(this, message);
	this.name = "PropertyError";
	this.property = property;
}
util.inherits(PropertyError, CustomError);
PropertyError.prototype.constructor = PropertyError;


function duplicatingUniquePropertyError(property, message) {
	PropertyError.call(this, property, message);
	this.name = "duplicatingUniquePropertyError";
}
util.inherits(duplicatingUniquePropertyError, PropertyError);
duplicatingUniquePropertyError.prototype.constructor = duplicatingUniquePropertyError;


function HttpError(status, message) {
	CustomError.call(this, "Not found")
	this.name = "HttpError";

	this.status = status;
	this.message = message || http.STATUS_CODES[status] || "Error";
}
util.inherits(HttpError, CustomError);
HttpError.prototype.constructor = HttpError;


module.exports = {
	HttpError,
	PropertyError,
	duplicatingUniquePropertyError
};