const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.get('/all', getAllUsers)

module.exports = router; 