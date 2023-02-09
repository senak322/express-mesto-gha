const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUsersById, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/me', getMe);

router.get('/users', getUsers);

router.get('/users/:userId', getUsersById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;
