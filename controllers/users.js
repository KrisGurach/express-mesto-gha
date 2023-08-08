/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
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

const getUserById = (req, res) => {
  const id = req.params.userId;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при поиске пользователя.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundErrorCode).send(createError(userNotFound(id)));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

const createUser = (req, res) => {
  const { about, avatar, name } = req.body;

  User.create({ name, about, avatar })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при создании пользователя.'));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при обновлении профиля.'));
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(notFoundErrorCode).send(createError(userNotFound(id)));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при обновлении аватара.'));
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(notFoundErrorCode).send(createError(userNotFound(id)));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
