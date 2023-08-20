const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { notFoundErrorCode, createError } = require('../helpers/errorHelpers');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((_, res) => res.status(notFoundErrorCode).send(createError('Not found')));

module.exports = router;
