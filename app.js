const express = require('express');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
