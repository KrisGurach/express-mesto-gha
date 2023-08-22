const { notFoundErrorCode } = require('./errorHelpers');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notFoundErrorCode;
  }
}

module.exports = NotFoundError;
