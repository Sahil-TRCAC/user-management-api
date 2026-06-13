const express = require('express');
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { validateCreateUser, validateUpdateUser } = require('../validators/userValidator');

const router = express.Router();

router.route('/').get(getUsers).post(validateCreateUser, createUser);
router.route('/:id').get(getUserById).put(validateUpdateUser, updateUser).delete(deleteUser);

module.exports = router;
