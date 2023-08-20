/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  createError,
  serverErrorCode,
  validationErrorCode,
  notFoundErrorCode,
} = require('../helpers/errorHelpers');

const userNotFound = (id) => `Пользователь с указанным id = ${id} не найден.`;

function getAllUsers(_, res) {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(serverErrorCode).send(createError()));
}

function findUserById(id, res) {
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res
          .status(validationErrorCode)
          .send(
            createError('Переданы некорректные данные при поиске пользователя.'),
          );
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundErrorCode).send(createError(userNotFound(id)));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
}

const getUserById = (req, res) => {
  const id = req.params.userId;
  findUserById(id, res);
};

const createUser = (req, res) => {
  const {
    about,
    avatar,
    name,
    email,
    password,
  } = req.body;

  const validationErrorMessage = 'Переданы некорректные данные при создании пользователя.';

  if (!password) {
    res.status(validationErrorCode).send(createError(validationErrorMessage));
    return;
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
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res
          .status(validationErrorCode)
          .send(createError(validationErrorMessage));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

const updateById = (req, res, parameters) => {
  const id = req.user._id;

  User.findByIdAndUpdate(id, parameters, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  updateById(req, res, { name, about });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateById(req, res, { avatar });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const getCurrentUserById = (req, res) => {
  const id = req.user._id;
  findUserById(id, res);
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
