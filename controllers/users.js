const User = require('../models/user');

const { NotFoundError, CreateError } = require('../errors/NotFoundError');

const NOTFOUND_CODE = 404;

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
      console.log(err);
      if (err.name === 'CastError') {
        res.status(NOTFOUND_CODE).send(err.message);
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
      if (err.name === 'CreateError') {
        res.status(err.statusCode).send(err.message);
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
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send(err));
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getUsers, getUsersById, createUser, updateUser, updateAvatar,
};
