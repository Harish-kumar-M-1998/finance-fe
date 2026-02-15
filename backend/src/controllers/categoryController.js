// backend/src/controllers/categoryController.js
// const { PrismaClient } = require('@prisma/client');

const prisma = require('../lib/prisma');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        message: 'Name and color are required',
      });
    }

    // Check if category with same name exists for user
    const existing = await prisma.category.findFirst({
      where: {
        userId: req.userId,
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: 'Category with this name already exists',
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId: req.userId,
      },
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If name is being changed, check for duplicates
    if (name && name !== category.name) {
      const existing = await prisma.category.findFirst({
        where: {
          userId: req.userId,
          name: { equals: name, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (existing) {
        return res.status(409).json({
          message: 'Category with this name already exists',
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    });

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.userId,
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category._count.expenses > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with existing expenses',
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};