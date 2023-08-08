const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createError, notFoundErrorCode } = require('./helpers/errorHelpers');

const app = express();

const { PORT = 3000 } = process.env;

try {
  mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
    useNewUrlParser: true,
  });
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(`error connection: ${err}`);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, _, next) => {
  req.user = {
    _id: '64ce4ba9ad564cdf1b00faec',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((_, res) => res.status(notFoundErrorCode).send(createError('Not found')));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
