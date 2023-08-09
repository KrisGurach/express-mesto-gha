const router = require('express').Router();
const { notFoundErrorCode, createError } = require('../helpers/errorHelpers');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((_, res) => res.status(notFoundErrorCode).send(createError('Not found')));

module.exports = router;
