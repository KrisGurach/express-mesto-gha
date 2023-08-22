const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { notFoundErrorCode, createError, serverErrorCode } = require('../helpers/errors/errorHelpers');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

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
