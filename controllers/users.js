const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const User = require('../models/user');

const { NotFoundError } = require('../errors/NotFoundError');
const { CreateError } = require('../errors/CreateError');
const { NotAuthorized } = require('../errors/NotAuthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

// const randomString = crypto.randomBytes(32).toString('hex');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
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
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          next(err);
        });
    });
};

const updateUser = (req, res, next) => {
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
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
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
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new NotAuthorized('Неправильные почта или пароль');
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        return res.send({ jwt: token });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers, getUsersById, createUser, updateUser, updateAvatar, login, getMe,
};
