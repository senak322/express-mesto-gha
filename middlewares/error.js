const error = (err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: err.message });
    return;
  }
  if (err.name === 'NotFoundError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (err.code === 11000) {
    res.status(409).send({ message: 'Данный E-mail занят' });
    return;
  }
  if (err.name === 'CreateError') {
    res.status(err.statusCode).send({ message: 'Переданы некорректные данные при создании' });
    return;
  }
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }
  if (err.name === 'Forbidden') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (err.name === 'NotAuthorized') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: 'На свервере что-то пошло не так' });
  next();
};

module.exports = { error };
