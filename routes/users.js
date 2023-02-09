const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUsersById, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

const urlRegExp = /(http|https):\/\/(www\.)?([-A-Za-z0-9]{1,256}(\b.)?[A-Za-z0-9]{1,})([-A-Za-z0-9/]*)/;

router.get('/me', getMe);

router.get('/users', getUsers);

router.get('/users/:userId', getUsersById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp),
  }),
}), updateAvatar);

module.exports = router;
