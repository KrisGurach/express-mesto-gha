/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const User = require('../models/user');

const createError = (error, message) => {
  if (!message) {
    // eslint-disable-next-line no-param-reassign
    message = error.message;
  }

  return { message };
};

function getAllUsers(_, res) {
  User.find({})
    .then((data) => res.send(data))
    .catch((e) => res.status(500).send(createError(e)));
}

const getUserById = (req, res) => {
  const id = req.params.userId;

  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(400).send(createError(e, 'Переданы некорректные данные при поиске пользователя.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send(createError(e, `Пользователь с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError(e));
      }
    });
};

const createUser = (req, res) => {
  const { about, avatar, name } = req.body;

  User.create({ name, about, avatar })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(400).send(createError(e, 'Переданы некорректные данные при создании пользователя.'));
      } else {
        res.status(500).send(createError(e));
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
        res.status(400).send(createError(e, 'Переданы некорректные данные при обновлении профиля.'));
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(404).send(createError(e, `Пользователь с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError(e));
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
        res.status(400).send(createError(e, 'Переданы некорректные данные при обновлении аватара.'));
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(404).send(createError(e, `Пользователь с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError(e));
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
