const { notAuthorizedErrorCode } = require('./errorHelpers');

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notAuthorizedErrorCode;
  }
}

module.exports = NotAuthorizedError;
