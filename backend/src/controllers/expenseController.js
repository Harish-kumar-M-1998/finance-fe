// backend/src/controllers/expenseController.js
// const { PrismaClient } = require('@prisma/client');

const prisma = require('../lib/prisma');

exports.getAllExpenses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      categoryId,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = { userId: req.userId };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Execute query with pagination
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: parseInt(limit),
      }),
      prisma.expense.count({ where }),
    ]);

    res.json({
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ expense });
  } catch (error) {
    next(error);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, categoryId, date, notes } = req.body;

    // Validation
    if (!title || !amount || !categoryId) {
      return res.status(400).json({
        message: 'Title, amount, and category are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: req.userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        notes,
        categoryId,
        userId: req.userId,
      },
      include: {
        category: true,
      },
    });

    // Create corresponding debit transaction
    await prisma.balanceTransaction.create({
      data: {
        type: 'DEBIT',
        amount: parseFloat(amount),
        description: `Expense: ${title}`,
        userId: req.userId,
      },
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, amount, categoryId, date, notes } = req.body;

    // Find existing expense
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If category changed, verify it belongs to user
    if (categoryId && categoryId !== existingExpense.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: req.userId,
        },
      });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    // Update expense
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(categoryId && { categoryId }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        category: true,
      },
    });

    res.json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and verify ownership
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Delete expense (cascade will handle planExpenses)
    await prisma.expense.delete({
      where: { id },
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = { userId: req.userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    // Get total expenses
    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
    });

    const total = expenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );

    // Group by category
    const byCategory = expenses.reduce((acc, exp) => {
      const categoryName = exp.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          color: exp.category.color,
          total: 0,
          count: 0,
        };
      }
      acc[categoryName].total += parseFloat(exp.amount);
      acc[categoryName].count += 1;
      return acc;
    }, {});

    // Get today's expenses
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayExpenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const todayTotal = todayExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );

    // Get this month's expenses
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthExpenses = await prisma.expense.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const monthTotal = monthExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );

    res.json({
      total: total.toFixed(2),
      count: expenses.length,
      byCategory: Object.values(byCategory),
      today: {
        total: todayTotal.toFixed(2),
        count: todayExpenses.length,
      },
      thisMonth: {
        total: monthTotal.toFixed(2),
        count: monthExpenses.length,
      },
    });
  } catch (error) {
    next(error);
  }
};