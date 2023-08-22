const { duplicateUniqueValueErrorCode } = require('./errorHelpers');

class DuplicateUniqueValueError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = duplicateUniqueValueErrorCode;
  }
}

module.exports = DuplicateUniqueValueError;
