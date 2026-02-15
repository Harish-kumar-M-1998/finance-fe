
// frontend/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { SpendingChart } from '../components/dashboard/SpendingChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { useBalanceStore } from '../store/balanceStore';
import { useExpenseStore } from '../store/expenseStore';

export const Dashboard = () => {
  const { balance, transactions, fetchBalance, fetchHistory } = useBalanceStore();
  const { stats, fetchStats } = useExpenseStore();

  useEffect(() => {
    fetchBalance();
    fetchHistory({ limit: 10 });
    fetchStats();
  }, [fetchBalance, fetchHistory, fetchStats]);

  const categoryData = stats?.byCategory?.map((cat) => ({
    name: cat.name,
    value: parseFloat(cat.total),
    color: cat.color,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your finances</p>
      </div>

      <BalanceCard
        balance={balance}
        todaySpending={stats?.today?.total || 0}
        monthlySpending={stats?.thisMonth?.total || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart data={[]} />
        <CategoryChart data={categoryData} />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  );
};