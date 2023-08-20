const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUserById,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getCurrentUserById);

router.get('/:userId', getUserById);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
