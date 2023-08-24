const { forbiddenErrorCode } = require('./errorHelpers');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = forbiddenErrorCode;
  }
}

module.exports = ForbiddenError;
