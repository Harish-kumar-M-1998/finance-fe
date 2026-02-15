const express = require('express');
const balanceController = require('../controllers/balanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', balanceController.getBalance);
router.get('/history', balanceController.getHistory);
router.post('/credit', balanceController.addCredit);
router.post('/debit', balanceController.addDebit);

module.exports = router;
