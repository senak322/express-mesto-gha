const User = require('../models/user');

const { NotFoundError } = require('../errors/NotFoundError');
const { CreateError } = require('../errors/CreateError');

const ERROR_CODE = 400;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      res.status(500).send(err);
    });
};

const getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ mesasge: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ mesasge: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send(err);
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new CreateError('Переданы некорректные данные при создании пользователя');
      }
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ mesasge: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(err.statusCode).send({ mesasge: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err.name === 'CreateError') {
        res.status(err.statusCode).send({ mesasge: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send(err);
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (!user) {
        throw new CreateError('Переданы некорректные данные при создании пользователя');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ mesasge: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      if (err.name === 'CreateError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      res.status(500).send(err);
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (!user) {
        throw new CreateError('Переданы некорректные данные при обновлении аватара');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ mesasge: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      if (err.name === 'CreateError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      res.status(500).send(err);
    });
};

module.exports = {
  getUsers, getUsersById, createUser, updateUser, updateAvatar,
};
