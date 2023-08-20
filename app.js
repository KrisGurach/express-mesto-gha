const express = require('express');
const mongoose = require('mongoose');

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

app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on port ${PORT}`);
});
