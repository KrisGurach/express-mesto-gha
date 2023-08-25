/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUserById,
} = require('../controllers/users');
const { pattern } = require('../helpers/constantsHelpers');

router.get('/', getAllUsers);

router.get('/me', getCurrentUserById);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(pattern),
  }),
}), updateAvatar);

module.exports = router;
