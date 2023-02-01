const { BadReqest } = require('../errors/BadReqest');

const returnPromiseError = (req, res) => Promise.reject(new BadReqest('Указанный адрес не найден')).catch((err) => {
  res.status(err.statusCode).send({ message: 'Указанный адрес не найден' });
});

module.exports = returnPromiseError;
