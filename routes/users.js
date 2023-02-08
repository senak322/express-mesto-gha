const router = require('express').Router();
const {
  getUsers, getUsersById, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/me', getMe);

router.get('/users', getUsers);

router.get('/users/:userId', getUsersById);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
