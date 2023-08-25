const mongoose = require('mongoose');
const Card = require('../models/card');
const ValidationError = require('../helpers/errors/validationError');
const NotFoundError = require('../helpers/errors/notFoundError');
const ForbiddenError = require('../helpers/errors/forbiddenError');
const { createSuccessStatusCode } = require('../helpers/constantsHelpers');
const ServerError = require('../helpers/errors/serverError');

const getAllCards = (_, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const id = req.params.cardId;

  Card.findById(id)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new mongoose.Error.ValidationError();
      }

      Card.deleteOne(card)
        .orFail()
        .then((data) => res.send(data))
        .catch(next);
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ForbiddenError('Можно удалять только собственные карточки.'));
      } else if (e instanceof mongoose.Error.CastError) {
        next(new ValidationError('Переданы некорректные данные при удалении карточки.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Карточка с указанным id = ${id} не найдена.`));
      } else {
        next(new ServerError());
      }
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.status(createSuccessStatusCode).send(data))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(new ServerError());
      }
    });
};

const addLike = (req, res, next) => {
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
        next(new ValidationError('Переданы некорректные данные для постановки лайка.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Передан несуществующий id = ${id} карточки.`));
      } else {
        next(new ServerError());
      }
    });
};

const deleteLike = (req, res, next) => {
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
        next(new ValidationError('Переданы некорректные данные для снятия лайка.'));
      } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Передан несуществующий id = ${id} карточки.`));
      } else {
        next(new ServerError());
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
