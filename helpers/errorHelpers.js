module.exports.createError = (error, message) => {
  if (!message) {
    // eslint-disable-next-line no-param-reassign
    message = error.message;
  }

  return { message };
};
