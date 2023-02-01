const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { CreateError } = require('../errors/CreateError');

const ERROR_CODE = 400;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Данные не найдены');
      }
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ mesasge: 'Данные не найдены' });
        return;
      }
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      res.status(500).send(err);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new CreateError('Переданы некорректные данные при создании карточки');
      }
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ mesasge: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(err.statusCode).send(err.message);
        return;
      }
      if (err.name === 'CreateError') {
        res.status(err.statusCode).send({ mesasge: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send(err);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ mesasge: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(500).send(err);
    });
};

const likeCard = (req, res) => {
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
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ mesasge: 'Передан несуществующий _id карточки.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ mesasge: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      res.status(500).send(err);
    });
};

const dislikeCard = (req, res) => {
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
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ mesasge: 'Передан несуществующий _id карточки.' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ mesasge: 'Переданы некорректные данные для постановки/снятии лайка' });
        return;
      }
      res.status(500).send(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
