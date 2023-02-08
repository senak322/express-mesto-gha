const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');

const { NotFoundError } = require('../errors/NotFoundError');
const { CreateError } = require('../errors/CreateError');

const randomString = crypto.randomBytes(32).toString('hex');

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
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send(err);
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          if (!user) {
            throw new CreateError('Переданы некорректные данные при создании пользователя');
          }
          res.status(201).send({
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          console.log(err.code);
          if (err.code === '11000') {
            res.status(400).send({ message: 'Данный E-mail занят' });
            return;
          }
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
            return;
          }
          if (err.name === 'CastError') {
            res.status(err.statusCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
            return;
          }
          if (err.name === 'CreateError') {
            res.status(err.statusCode).send({ message: 'Переданы некорректные данные при создании пользователя' });
            return;
          }
          res.status(500).send(err);
        });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new CreateError('Переданы некорректные данные при создании пользователя');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
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
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new CreateError('Переданы некорректные данные при обновлении аватара');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
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

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, randomString, { expiresIn: '7d' });
        return res.send({ jwt: token });
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const getMe = (req, res) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send(err);
    });
};

module.exports = {
  getUsers, getUsersById, createUser, updateUser, updateAvatar, login, randomString, getMe,
};
