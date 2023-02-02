const express = require('express');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const bodyParser = require('body-parser');

const rateLimit = require ('express-rate-limit');

const helmet = require('helmet');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const returnPromiseError = require('./routes/badReqest');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63d957ebf3bc5525f6ca12cc',
  };

  next();
});

app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.use(userRouter);
app.use(cardRouter);
app.use('*', returnPromiseError);

app.listen(PORT, () => {});
