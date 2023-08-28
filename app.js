const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const { serverErrorCode } = require('./helpers/errors/errorHelpers');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, _, res, __) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === serverErrorCode
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
