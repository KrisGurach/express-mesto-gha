const router = require('express').Router();
const { notFoundErrorCode, createError } = require('../helpers/errorHelpers');

router.use((req, _, next) => {
  req.user = {
    _id: '64ce4ba9ad564cdf1b00faec',
  };

  next();
});

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((_, res) => res.status(notFoundErrorCode).send(createError('Not found')));

module.exports = router;
