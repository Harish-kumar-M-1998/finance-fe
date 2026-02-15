// backend/src/controllers/importController.js
// const { PrismaClient } = require('@prisma/client');
const Papa = require('papaparse');
const XLSX = require('xlsx');
const fs = require('fs').promises;

const prisma = require('../lib/prisma');

exports.importCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileContent = await fs.readFile(req.file.path, 'utf-8');

    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (parsed.errors.length > 0) {
      return res.status(400).json({
        message: 'Error parsing CSV file',
        errors: parsed.errors,
      });
    }

    // Clean up file
    await fs.unlink(req.file.path);

    res.json({
      message: 'CSV parsed successfully',
      data: parsed.data,
      meta: parsed.meta,
    });
  } catch (error) {
    next(error);
  }
};

exports.importExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Clean up file
    await fs.unlink(req.file.path);

    res.json({
      message: 'Excel file parsed successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.confirmImport = async (req, res, next) => {
  try {
    const { expenses } = req.body;

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return res.status(400).json({
        message: 'Expenses array is required',
      });
    }

    // Get user's categories
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
    });

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name.toLowerCase()] = cat.id;
      return acc;
    }, {});

    const results = {
      imported: 0,
      failed: 0,
      errors: [],
    };

    for (const expense of expenses) {
      try {
        const { title, amount, category, date, notes } = expense;

        if (!title || !amount || !category) {
          results.failed++;
          results.errors.push({
            expense,
            error: 'Missing required fields',
          });
          continue;
        }

        // Find or create category
        let categoryId = categoryMap[category.toLowerCase()];

        if (!categoryId) {
          const newCategory = await prisma.category.create({
            data: {
              name: category,
              color: '#' + Math.floor(Math.random() * 16777215).toString(16),
              userId: req.userId,
            },
          });
          categoryId = newCategory.id;
          categoryMap[category.toLowerCase()] = categoryId;
        }

        // Create expense
        const createdExpense = await prisma.expense.create({
          data: {
            title,
            amount: parseFloat(amount),
            date: date ? new Date(date) : new Date(),
            notes,
            categoryId,
            userId: req.userId,
          },
        });

        // Create debit transaction
        await prisma.balanceTransaction.create({
          data: {
            type: 'DEBIT',
            amount: parseFloat(amount),
            description: `Import: ${title}`,
            userId: req.userId,
          },
        });

        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          expense,
          error: error.message,
        });
      }
    }

    res.json({
      message: 'Import completed',
      results,
    });
  } catch (error) {
    next(error);
  }
};