const router = require('express').Router();
const { getAllCards, deleteCardById, createCard } = require('../controllers/cards');

router.get('/', getAllCards);

router.delete('/:cardId', deleteCardById);

router.post('/', createCard);

module.exports = router;
