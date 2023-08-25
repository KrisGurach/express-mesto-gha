/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { secretKey, createSuccessStatusCode } = require('../helpers/constantsHelpers');
const ValidationError = require('../helpers/errors/validationError');
const NotFoundError = require('../helpers/errors/notFoundError');
const DuplicateUniqueValueError = require('../helpers/errors/duplicateUniqueValueError');
const ServerError = require('../helpers/errors/serverError');

const userNotFound = (id) => `Пользователь с указанным id = ${id} не найден.`;

function getAllUsers(_, res, next) {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
}

function findUserById(id, res, next) {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(userNotFound(id)));
      } else {
        next(new ServerError());
      }
    });
}

const getUserById = (req, res, next) => {
  const id = req.params.userId;
  findUserById(id, res, next);
};

const createUser = (req, res, next) => {
  const {
    about,
    avatar,
    name,
    email,
    password,
  } = req.body;

  const validationErrorMessage = 'Переданы некорректные данные при создании пользователя.';

  if (!password) {
    throw new ValidationError(validationErrorMessage);
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      // eslint-disable-next-line no-shadow
      const { password, ...data } = user._doc;
      res.status(createSuccessStatusCode).send(data);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(validationErrorMessage));
      } else if (e.code === 11000) {
        next(new DuplicateUniqueValueError('Ползователь с указанным email уже существует'));
      } else {
        next(new ServerError());
      }
    });
};

const updateById = (req, res, parameters, next) => {
  const id = req.user._id;

  User.findByIdAndUpdate(id, parameters, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(new ServerError());
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  updateById(req, res, { name, about }, next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateById(req, res, { avatar }, next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUserById = (req, res, next) => {
  const id = req.user._id;
  findUserById(id, res, next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUserById,
};
