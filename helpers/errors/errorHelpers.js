const defaultErrorMessage = 'На сервере произошла ошибка';
module.exports.notAuthorizedErrorMessage = 'Необходима авторизация';

module.exports.createError = (message) => {
  if (!message) {
    // eslint-disable-next-line no-param-reassign
    message = defaultErrorMessage;
  }

  return { message };
};

module.exports.validationErrorCode = 400;
module.exports.notAuthorizedErrorCode = 401;
module.exports.notFoundErrorCode = 404;
module.exports.duplicateUniqueValueErrorCode = 409;
module.exports.serverErrorCode = 500;
