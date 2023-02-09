const { NotAuthorized } = require('../errors/NotAuthorized');

const jwt = require('jsonwebtoken');
const { randomString } = require('../controllers/users');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorized('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, randomString);
  } catch (err) {
    return next(new NotAuthorized('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
