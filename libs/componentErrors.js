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


function ClientError(message) {
	ComponentError.call(this, message || 'An error has occurred. Check if javascript is enabled');
	this.name = "ClientError";
}
ClientError.prototype = Object.create(ComponentError.prototype);
ClientError.prototype.constructor = ClientError;


function ServerError(message) {
	ComponentError.call(this, message || 'There is some error on the server side');
	this.name = "ServerError";
}
ServerError.prototype = Object.create(ComponentError.prototype);
ServerError.prototype.constructor = ServerError;

module.exports = {
	ComponentError,
	ClientError,
	ServerError
};