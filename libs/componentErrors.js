function CustomError(message) {
	this.name = "CustomError";
	this.message = message;

	if (Error.captureStackTrace)
		Error.captureStackTrace(this, CustomError);
	else
		this.stack = (new Error()).stack;
}
CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;


function ComponentError(message) {
	CustomError.call(this, message || 'An error has occurred' );
	this.name = "ComponentError";
}
ComponentError.prototype = Object.create(CustomError.prototype);
ComponentError.prototype.constructor = ComponentError;


function ClientError(message, detail) {
	ComponentError.call(this, message || 'An error has occurred. Check if javascript is enabled');
	this.name = "ClientError";
	this.detail = detail;
}
ClientError.prototype = Object.create(ComponentError.prototype);
ClientError.prototype.constructor = ClientError;


function ImageNotFound(message, detail) {
    ClientError.call(this, message || 'Image not found. It probably has been removed');
    this.name = "ImageNotFound";
    this.detail = detail;
}
ImageNotFound.prototype = Object.create(ClientError.prototype);
ImageNotFound.prototype.constructor = ImageNotFound;

function ServerError(message) {
	ComponentError.call(this, message || 'There is some error on the server side');
	this.name = "ServerError";
}
ServerError.prototype = Object.create(ComponentError.prototype);
ServerError.prototype.constructor = ServerError;

module.exports = {
	ComponentError,
	ClientError,
    ImageNotFound,
	ServerError
};
