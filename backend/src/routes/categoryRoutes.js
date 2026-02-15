
const express = require('express');
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', expenseController.getAllExpenses);
router.get('/stats', expenseController.getExpenseStats);
router.get('/:id', expenseController.getExpenseById);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;