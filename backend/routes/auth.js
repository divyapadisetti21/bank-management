const express = require('express');
const { registerUser, loginUser, logoutUser, getLoggedInUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/user', protect, getLoggedInUser);

module.exports = router;