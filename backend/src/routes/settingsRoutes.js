
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = require('../lib/prisma');


router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    let settings = await prisma.userSettings.findUnique({
      where: { userId: req.userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: req.userId,
          currency: 'USD',
        },
      });
    }

    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { currency, dailyLimit, monthlyLimit } = req.body;

    const settings = await prisma.userSettings.upsert({
      where: { userId: req.userId },
      update: {
        ...(currency && { currency }),
        ...(dailyLimit !== undefined && {
          dailyLimit: dailyLimit ? parseFloat(dailyLimit) : null,
        }),
        ...(monthlyLimit !== undefined && {
          monthlyLimit: monthlyLimit ? parseFloat(monthlyLimit) : null,
        }),
      },
      create: {
        userId: req.userId,
        currency: currency || 'USD',
        dailyLimit: dailyLimit ? parseFloat(dailyLimit) : null,
        monthlyLimit: monthlyLimit ? parseFloat(monthlyLimit) : null,
      },
    });

    res.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;