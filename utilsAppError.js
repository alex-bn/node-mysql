class AppError extends Error {
  constructor(message, statusCode) {
    // setting the message property to my incoming message
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    // mark error that go through this class as operational error
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
