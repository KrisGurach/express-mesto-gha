/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { celebrate, errors, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { notFoundErrorCode, createError, serverErrorCode } = require('../helpers/errors/errorHelpers');
const auth = require('../middlewares/auth');
const { pattern } = require('../helpers/constantsHelpers');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(pattern),
  }),
}), createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use(errors());

// eslint-disable-next-line no-unused-vars
router.use((err, _, res, __) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === serverErrorCode
        ? 'На сервере произошла ошибка'
        : message,
    });
});

router.use((_, res) => res.status(notFoundErrorCode).send(createError('Not found')));

module.exports = router;
