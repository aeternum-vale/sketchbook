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


function ComponentError(message, status) {
	CustomError.call(this, message || 'An error has occurred' );
	this.name = "ComponentError";
	this.status = status;
}
ComponentError.prototype = Object.create(CustomError.prototype);
ComponentError.prototype.constructor = ComponentError;

function ClientError(message, detail, status) {
	ComponentError.call(this, message || 'An error has occurred. Retry later', status);
	this.name = "ClientError";
	this.detail = detail;
}
ClientError.prototype = Object.create(ComponentError.prototype);
ClientError.prototype.constructor = ClientError;


function ImageNotFound(message) {
    ClientError.call(this, message || 'Image not found. It probably has been removed', null, 404);
    this.name = "ImageNotFound";
}
ImageNotFound.prototype = Object.create(ClientError.prototype);
ImageNotFound.prototype.constructor = ImageNotFound;

function ServerError(message, status) {
	ComponentError.call(this, message || 'There is some error on the server side. Retry later', status);
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
