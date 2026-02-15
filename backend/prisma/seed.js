// backend/prisma/seed.js
// const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = require('../src/lib/prisma');

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.planExpense.deleteMany();
  await prisma.recurringExpense.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.category.deleteMany();
  await prisma.balanceTransaction.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  console.log('Creating demo user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@financemanager.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create user settings
  console.log('Creating user settings...');
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      currency: 'USD',
      dailyLimit: 100,
      monthlyLimit: 3000,
    },
  });

  console.log('✅ Created user settings');

  // Create categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Food & Dining', color: '#FF6B6B', userId: user.id },
    }),
    prisma.category.create({
      data: { name: 'Transportation', color: '#4ECDC4', userId: user.id },
    }),
    prisma.category.create({
      data: { name: 'Shopping', color: '#45B7D1', userId: user.id },
    }),
    prisma.category.create({
      data: { name: 'Entertainment', color: '#FFA07A', userId: user.id },
    }),
    prisma.category.create({
      data: { name: 'Bills & Utilities', color: '#98D8C8', userId: user.id },
    }),
    prisma.category.create({
      data: { name: 'Healthcare', color: '#F06292', userId: user.id },
    }),
    prisma.category.create({
      data: { name: 'Other', color: '#9E9E9E', userId: user.id },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Add initial balance
  console.log('Adding initial balance...');
  await prisma.balanceTransaction.create({
    data: {
      type: 'CREDIT',
      amount: 5000,
      description: 'Initial balance',
      userId: user.id,
    },
  });

  console.log('✅ Added initial balance: $5000');

  // Create sample expenses for the last 30 days
  console.log('Creating sample expenses...');
  const expenses = [];
  const today = new Date();
  
  const expenseTemplates = [
    { title: 'Grocery Shopping', categoryIndex: 0, minAmount: 50, maxAmount: 150 },
    { title: 'Coffee Shop', categoryIndex: 0, minAmount: 5, maxAmount: 15 },
    { title: 'Restaurant Dinner', categoryIndex: 0, minAmount: 30, maxAmount: 80 },
    { title: 'Gas Station', categoryIndex: 1, minAmount: 40, maxAmount: 70 },
    { title: 'Uber Ride', categoryIndex: 1, minAmount: 10, maxAmount: 25 },
    { title: 'Online Shopping', categoryIndex: 2, minAmount: 25, maxAmount: 100 },
    { title: 'Clothing Store', categoryIndex: 2, minAmount: 40, maxAmount: 150 },
    { title: 'Movie Tickets', categoryIndex: 3, minAmount: 15, maxAmount: 40 },
    { title: 'Streaming Service', categoryIndex: 3, minAmount: 10, maxAmount: 20 },
    { title: 'Electricity Bill', categoryIndex: 4, minAmount: 80, maxAmount: 150 },
    { title: 'Internet Bill', categoryIndex: 4, minAmount: 50, maxAmount: 100 },
    { title: 'Pharmacy', categoryIndex: 5, minAmount: 15, maxAmount: 60 },
  ];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create 1-3 expenses per day
    const expensesPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < expensesPerDay; j++) {
      const template = expenseTemplates[Math.floor(Math.random() * expenseTemplates.length)];
      const category = categories[template.categoryIndex];
      const amount = (Math.random() * (template.maxAmount - template.minAmount) + template.minAmount).toFixed(2);
      
      const expense = await prisma.expense.create({
        data: {
          title: template.title,
          amount: parseFloat(amount),
          date,
          notes: `Sample expense from ${date.toLocaleDateString()}`,
          categoryId: category.id,
          userId: user.id,
        },
      });
      
      expenses.push(expense);
      
      // Create corresponding debit transaction
      await prisma.balanceTransaction.create({
        data: {
          type: 'DEBIT',
          amount: parseFloat(amount),
          description: `Expense: ${expense.title}`,
          userId: user.id,
          createdAt: date,
        },
      });
    }
  }

  console.log(`✅ Created ${expenses.length} sample expenses`);

  // Add some additional credit transactions
  console.log('Adding additional credit transactions...');
  const creditTransactions = [
    { amount: 2500, description: 'Salary Payment', daysAgo: 15 },
    { amount: 500, description: 'Freelance Income', daysAgo: 10 },
    { amount: 1000, description: 'Bonus', daysAgo: 5 },
  ];

  for (const credit of creditTransactions) {
    const date = new Date(today);
    date.setDate(date.getDate() - credit.daysAgo);
    
    await prisma.balanceTransaction.create({
      data: {
        type: 'CREDIT',
        amount: credit.amount,
        description: credit.description,
        userId: user.id,
        createdAt: date,
      },
    });
  }

  console.log('✅ Added credit transactions');

  // Create sample plans
  console.log('Creating sample plans...');
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const plan1 = await prisma.plan.create({
    data: {
      name: 'Monthly Budget',
      budgetAmount: 2000,
      startDate: currentMonth,
      endDate: nextMonth,
      userId: user.id,
    },
  });

  const plan2 = await prisma.plan.create({
    data: {
      name: 'Vacation Fund',
      budgetAmount: 1500,
      startDate: currentMonth,
      endDate: new Date(today.getFullYear(), today.getMonth() + 3, 0),
      userId: user.id,
    },
  });

  console.log('✅ Created 2 financial plans');

  // Link some expenses to the monthly budget plan
  console.log('Linking expenses to plans...');
  const recentExpenses = expenses.slice(0, 8);
  
  for (const expense of recentExpenses) {
    await prisma.planExpense.create({
      data: {
        planId: plan1.id,
        expenseId: expense.id,
      },
    });
  }

  console.log(`✅ Linked ${recentExpenses.length} expenses to Monthly Budget plan`);

  // Create recurring expenses
  console.log('Creating recurring expenses...');
  const nextMonth1st = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  const recurringExpenses = [
    { title: 'Netflix Subscription', amount: 15.99, frequency: 'MONTHLY' },
    { title: 'Spotify Premium', amount: 9.99, frequency: 'MONTHLY' },
    { title: 'Gym Membership', amount: 49.99, frequency: 'MONTHLY' },
    { title: 'Cloud Storage', amount: 2.99, frequency: 'MONTHLY' },
  ];

  for (const recurring of recurringExpenses) {
    await prisma.recurringExpense.create({
      data: {
        title: recurring.title,
        amount: recurring.amount,
        frequency: recurring.frequency,
        nextRun: nextMonth1st,
        userId: user.id,
      },
    });
  }

  console.log(`✅ Created ${recurringExpenses.length} recurring expenses`);

  // Calculate and display final balance
  const allTransactions = await prisma.balanceTransaction.findMany({
    where: { userId: user.id },
  });

  const balance = allTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'CREDIT') {
      return acc + parseFloat(transaction.amount);
    } else {
      return acc - parseFloat(transaction.amount);
    }
  }, 0);

  console.log('\n📊 Database Seed Summary:');
  console.log('========================');
  console.log(`👤 User: ${user.email}`);
  console.log(`🔑 Password: password123`);
  console.log(`💰 Current Balance: $${balance.toFixed(2)}`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log(`💸 Expenses: ${expenses.length}`);
  console.log(`📈 Plans: 2`);
  console.log(`🔄 Recurring Expenses: ${recurringExpenses.length}`);
  console.log('========================\n');
  
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });