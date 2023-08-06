const router = require('express').Router();
const {
  getAllCards,
  deleteCardById,
  createCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.delete('/:cardId', deleteCardById);

router.post('/', createCard);

router.put('/:cardId/likes', addLike);

router.delete('/:cardId/likes', deleteLike);

module.exports = router;
