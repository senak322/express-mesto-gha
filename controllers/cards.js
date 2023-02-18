const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
// const { CreateError } = require('../errors/CreateError');
// const { BadReqest } = require('../errors/BadReqest');
const { Forbidden } = require('../errors/Forbidden');

// const ERROR_CODE = 400;

const getCards = (req, res, next) => {
  Card.find({}).sort({ createdAt: -1 })
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалять чужие карточки');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardEl) => {
            if (!cardEl) {
              throw new NotFoundError('Карточка с указанным _id не найдена');
            }
            res.status(200).send({ data: cardEl });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
