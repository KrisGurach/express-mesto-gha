const User = require('../models/user');

const getAllUsers = (_, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((e) => res.status(500).send({ message: e.message }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((e) => res.status(500).send({ message: e.message }));
};

const createUser = (req, res) => {
  const { about, avatar, name } = req.body;

  User.create({ name, about, avatar })
    .then((data) => res.send({ data }))
    .catch((e) => res.status(500).send({ message: e.message }));
};

module.exports = { getAllUsers, getUserById, createUser };
