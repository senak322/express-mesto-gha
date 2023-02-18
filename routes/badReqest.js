const { NotFoundError } = require('../errors/NotFoundError');

const returnPromiseError = (req, res, next) => next(new NotFoundError('Указанный адрес не найден'));

module.exports = returnPromiseError;
