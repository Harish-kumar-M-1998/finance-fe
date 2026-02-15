
const express = require('express');
const planController = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);
router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);
router.post('/:id/expenses', planController.addExpenseToPlan);
router.delete('/:id/expenses/:expenseId', planController.removeExpenseFromPlan);

module.exports = router;