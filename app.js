const express = require('express');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const bodyParser = require('body-parser');

// const path = require('path');

const userRouter = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {

});

app.use('/', userRouter);

// app.use(express.static(path.join(__dirname, 'build')));

app.listen(PORT, () => {
  console.log('hi');
  console.log(`App listening on port ${PORT}`);
});
