const { serverErrorCode } = require('./errorHelpers');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = serverErrorCode;
  }
}

module.exports = ServerError;
