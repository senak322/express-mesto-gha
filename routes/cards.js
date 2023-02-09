const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    link: Joi.string(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
