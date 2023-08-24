/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { notAuthorizedErrorMessage } = require('../helpers/errors/errorHelpers');
const { secretKey } = require('../helpers/constantsHelpers');
const NotAuthorizedError = require('../helpers/errors/authorizationError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError(notAuthorizedErrorMessage);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new NotAuthorizedError(notAuthorizedErrorMessage);
  }

  req.user = payload;

  next();
};
