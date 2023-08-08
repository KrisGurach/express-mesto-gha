const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  createError,
  serverErrorCode,
  validationErrorCode,
  notFoundErrorCode,
} = require('../helpers/errorHelpers');

const getAllCards = (_, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(serverErrorCode).send(createError()));
};

const deleteCardById = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndRemove(id)
    .orFail()
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при удалении карточки.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundErrorCode).send(createError(`Карточка с указанным id = ${id} не найдена.`));
      } else {
        res.status(serverErrorCode).send(createError());
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        res.status(validationErrorCode).send(createError('Переданы некорректные данные при создании карточки.'));
      } else {
        res.status(serverErrorCode).send(createError());
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
        res.status(validationErrorCode).send(createError('Переданы некорректные данные для постановки лайка.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundErrorCode).send(createError(`Передан несуществующий id = ${id} карточки.`));
      } else {
        res.status(serverErrorCode).send(createError());
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
        res.status(validationErrorCode).send(createError('Переданы некорректные данные для снятия лайка.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(notFoundErrorCode).send(createError(`Передан несуществующий id = ${id} карточки.`));
      } else {
        res.status(serverErrorCode).send(createError());
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
