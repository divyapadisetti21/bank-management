const express = require('express');
const { getTransactions, transferMoney, requestLoan } = require('../controllers/transactionsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getTransactions);
router.post('/transfer', protect, transferMoney);
router.post('/loan', protect, requestLoan);

module.exports = router;
