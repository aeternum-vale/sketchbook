function CustomError(message) {
	this.name = "CustomError";
	this.message = message;

	if (Error.captureStackTrace)
		Error.captureStackTrace(this, CustomError);
	else
		this.stack = (new Error()).stack;
}
CustomError.prototype = Object.crate(Error.prototype);
CustomError.prototype.constructor = CustomError;


function ComponentError(message) {
	CustomError.call(this, message);
	this.name = "ComponentError";
}
ComponentError.prototype = Object.crate(CustomError.prototype);
ComponentError.prototype.constructor = ComponentError;


function ClientError(message) {
	ComponentError.call(this, message);
	this.name = "ClientError";
}
ClientError.prototype = Object.crate(ComponentError.prototype);
ClientError.prototype.constructor = ClientError;


function ServerError(message) {
	ComponentError.call(this, message);
	this.name = "ServerError";
}
ServerError.prototype = Object.crate(ComponentError.prototype);
ServerError.prototype.constructor = ServerError;

module.exports = {
	ComponentError,
	ClientError,
	ServerError
};