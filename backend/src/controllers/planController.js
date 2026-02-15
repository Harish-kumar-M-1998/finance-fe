// backend/src/controllers/planController.js
// const { PrismaClient } = require('@prisma/client');

const prisma = require('../lib/prisma');

exports.getAllPlans = async (req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { userId: req.userId },
      include: {
        planExpenses: {
          include: {
            expense: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate spent amount for each plan
    const plansWithStats = plans.map((plan) => {
      const spent = plan.planExpenses.reduce(
        (sum, pe) => sum + parseFloat(pe.expense.amount),
        0
      );
      const remaining = parseFloat(plan.budgetAmount) - spent;
      const progress = (spent / parseFloat(plan.budgetAmount)) * 100;

      return {
        ...plan,
        spent: spent.toFixed(2),
        remaining: remaining.toFixed(2),
        progress: progress.toFixed(2),
      };
    });

    res.json({ plans: plansWithStats });
  } catch (error) {
    next(error);
  }
};

exports.getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        planExpenses: {
          include: {
            expense: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const spent = plan.planExpenses.reduce(
      (sum, pe) => sum + parseFloat(pe.expense.amount),
      0
    );
    const remaining = parseFloat(plan.budgetAmount) - spent;
    const progress = (spent / parseFloat(plan.budgetAmount)) * 100;

    res.json({
      plan: {
        ...plan,
        spent: spent.toFixed(2),
        remaining: remaining.toFixed(2),
        progress: progress.toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createPlan = async (req, res, next) => {
  try {
    const { name, budgetAmount, startDate, endDate } = req.body;

    if (!name || !budgetAmount || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Name, budget amount, start date, and end date are required',
      });
    }

    if (budgetAmount <= 0) {
      return res.status(400).json({
        message: 'Budget amount must be greater than 0',
      });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: 'End date must be after start date',
      });
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        budgetAmount: parseFloat(budgetAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: req.userId,
      },
    });

    res.status(201).json({
      message: 'Plan created successfully',
      plan,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, budgetAmount, startDate, endDate } = req.body;

    const plan = await prisma.plan.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(budgetAmount && { budgetAmount: parseFloat(budgetAmount) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    res.json({
      message: 'Plan updated successfully',
      plan: updatedPlan,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const plan = await prisma.plan.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    await prisma.plan.delete({
      where: { id },
    });

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.addExpenseToPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expenseId } = req.body;

    if (!expenseId) {
      return res.status(400).json({ message: 'Expense ID is required' });
    }

    // Verify plan belongs to user
    const plan = await prisma.plan.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Verify expense belongs to user
    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        userId: req.userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if already linked
    const existing = await prisma.planExpense.findFirst({
      where: {
        planId: id,
        expenseId,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: 'Expense already linked to this plan',
      });
    }

    const planExpense = await prisma.planExpense.create({
      data: {
        planId: id,
        expenseId,
      },
    });

    res.status(201).json({
      message: 'Expense added to plan successfully',
      planExpense,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeExpenseFromPlan = async (req, res, next) => {
  try {
    const { id, expenseId } = req.params;

    // Verify plan belongs to user
    const plan = await prisma.plan.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const planExpense = await prisma.planExpense.findFirst({
      where: {
        planId: id,
        expenseId,
      },
    });

    if (!planExpense) {
      return res.status(404).json({
        message: 'Expense not linked to this plan',
      });
    }

    await prisma.planExpense.delete({
      where: { id: planExpense.id },
    });

    res.json({ message: 'Expense removed from plan successfully' });
  } catch (error) {
    next(error);
  }
};