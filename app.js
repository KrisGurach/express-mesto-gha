const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.use((req, res, next) => {
  req.user = {
    _id: '64ce4ba9ad564cdf1b00faec',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Ready');
});
