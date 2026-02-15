  // backend/src/controllers/balanceController.js
// const { PrismaClient } = require('@prisma/client');

const prisma = require('../lib/prisma');

exports.getBalance = async (req, res, next) => {
  try {
    // Get all transactions for the user
    const transactions = await prisma.balanceTransaction.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate balance: credits - debits
    const balance = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'CREDIT') {
        return acc + parseFloat(transaction.amount);
      } else {
        return acc - parseFloat(transaction.amount);
      }
    }, 0);

    res.json({
      balance: balance.toFixed(2),
      transactionCount: transactions.length,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId: req.userId };
    if (type) {
      where.type = type;
    }

    const [transactions, total] = await Promise.all([
      prisma.balanceTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.balanceTransaction.count({ where }),
    ]);

    res.json({
      transactions,
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

exports.addCredit = async (req, res, next) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const transaction = await prisma.balanceTransaction.create({
      data: {
        type: 'CREDIT',
        amount: parseFloat(amount),
        description: description || 'Balance added',
        userId: req.userId,
      },
    });

    // Calculate new balance
    const transactions = await prisma.balanceTransaction.findMany({
      where: { userId: req.userId },
    });

    const balance = transactions.reduce((acc, t) => {
      return t.type === 'CREDIT'
        ? acc + parseFloat(t.amount)
        : acc - parseFloat(t.amount);
    }, 0);

    res.status(201).json({
      message: 'Credit added successfully',
      transaction,
      balance: balance.toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};

exports.addDebit = async (req, res, next) => {
  try {
    const { amount, description, title, categoryId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Create transaction and expense together
    const transaction = await prisma.balanceTransaction.create({
      data: {
        type: 'DEBIT',
        amount: parseFloat(amount),
        description: description || 'Expense recorded',
        userId: req.userId,
      },
    });

    // If expense details provided, create expense record
    if (title && categoryId) {
      await prisma.expense.create({
        data: {
          title,
          amount: parseFloat(amount),
          date: new Date(),
          notes: description,
          categoryId,
          userId: req.userId,
        },
      });
    }

    // Calculate new balance
    const transactions = await prisma.balanceTransaction.findMany({
      where: { userId: req.userId },
    });

    const balance = transactions.reduce((acc, t) => {
      return t.type === 'CREDIT'
        ? acc + parseFloat(t.amount)
        : acc - parseFloat(t.amount);
    }, 0);

    res.status(201).json({
      message: 'Debit recorded successfully',
      transaction,
      balance: balance.toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};