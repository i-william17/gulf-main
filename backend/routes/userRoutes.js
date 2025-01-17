const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.get('/all', getAllUsers);
router.post('/delete/:id', deleteUser);

module.exports = router; 