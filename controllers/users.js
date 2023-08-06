/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const User = require('../models/user');

const createError = (message) => {
  if (!message) {
    // eslint-disable-next-line no-param-reassign
    message = 'Произошла ошибка на сервере';
  }

  return { message };
};

function getAllUsers(_, res) {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send(createError()));
}

const getUserById = (req, res) => {
  const id = req.params.userId;

  User.findById(id)
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(404).send(createError(`Пользователь с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError());
      }
    });
};

const createUser = (req, res) => {
  const { about, avatar, name } = req.body;

  User.create({ name, about, avatar })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(400).send(createError('Переданы некорректные данные при создании пользователя.'));
      } else {
        res.status(500).send(createError());
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(400).send(createError('Переданы некорректные данные при обновлении профиля.'));
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(404).send(createError(`Пользователь с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError());
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { avatar })
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(400).send(createError('Переданы некорректные данные при обновлении аватара.'));
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(404).send(createError(`Пользователь с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError());
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
