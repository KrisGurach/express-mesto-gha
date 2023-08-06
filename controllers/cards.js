/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Card = require('../models/card');

const createError = (error, message) => {
  if (!message) {
    // eslint-disable-next-line no-param-reassign
    message = error.message;
  }

  return { message };
};

const getAllCards = (_, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((e) => res.status(500).send(createError(e)));
};

const deleteCardById = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndRemove(id)
    .orFail()
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(400).send(createError(e, 'Переданы некорректные данные при удалении карточки.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send(createError(e, `Карточка с указанным id = ${id} не найден.`));
      } else {
        res.status(500).send(createError(e));
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(400).send(createError(e, 'Переданы некорректные данные при создании карточки.'));
      } else {
        res.status(500).send(createError(e));
      }
    });
};

const addLike = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(400).send(createError(e, 'Переданы некорректные данные для постановки лайка.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send(createError(e, `Передан несуществующий id = ${id} карточки.`));
      } else {
        res.status(500).send(createError(e));
      }
    });
};

const deleteLike = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(400).send(createError(e, 'Переданы некорректные данные для снятия лайка.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send(createError(e, `Передан несуществующий id = ${id} карточки.`));
      } else {
        res.status(500).send(createError(e));
      }
    });
};

module.exports = {
  getAllCards,
  deleteCardById,
  createCard,
  addLike,
  deleteLike,
};
