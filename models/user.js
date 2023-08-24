const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const bcrypt = require('bcryptjs');
const NotAuthorizedError = require('../helpers/errors/authorizationError');
const { notAuthorizedErrorMessage: notAuthrizedErrorMessage } = require('../helpers/errors/errorHelpers');
const { pattern } = require('../helpers/constantsHelpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (src) => pattern.test(src),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthorizedError(notAuthrizedErrorMessage);
      }

      return bcrypt.compare(password, user.password)
        .then((valid) => {
          if (!valid) {
            throw new NotAuthorizedError(notAuthrizedErrorMessage);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
