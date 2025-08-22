const express = require('express');
const { closeAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/close-account', protect, closeAccount);

module.exports = router;
