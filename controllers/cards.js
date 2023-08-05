/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const getAllCards = (_, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((e) => res.status(500).send({ message: e.message }));
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => res.send(data))
    .catch((e) => res.status(500).send({ message: e.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((e) => res.status(500).send({ message: e.message }));
};

module.exports = { getAllCards, deleteCardById, createCard };
