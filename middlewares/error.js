const error = (err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: err.message });
    return;
  }
  if (err.code === 11000) {
    res.status(409).send({ message: 'Данный E-mail занят' });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }
  const { statusCode = 500 } = err;
  const errMessage = err.statusCode === 500 ? 'На свервере что-то пошло не так' : err.message;
  res.status(statusCode).send({ message: errMessage });
  next();
};

module.exports = { error };
