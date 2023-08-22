const { validationErrorCode } = require('./errorHelpers');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = validationErrorCode;
  }
}

module.exports = ValidationError;
