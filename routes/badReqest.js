const { BadReqest } = require('../errors/BadReqest');

const returnPromiseError = (req, res, next) => Promise.reject(new BadReqest('Указанный адрес не найден')).catch((err) => {
  next(err);
});

module.exports = returnPromiseError;
