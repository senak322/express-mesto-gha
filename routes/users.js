const router = require('express').Router();
const { getUsers, getUsersById, createUser } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/user:Id', getUsersById);

router.post('/users', createUser);

module.exports = router;
