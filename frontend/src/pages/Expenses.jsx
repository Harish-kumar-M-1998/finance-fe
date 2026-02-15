
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { ExpenseFilters } from '../components/expenses/ExpenseFilters';
import { useExpenseStore } from '../store/expenseStore';
import { useBalanceStore } from '../store/balanceStore';
import toast from 'react-hot-toast';

export const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({});
  
  const { expenses, loading, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenseStore();
  const { fetchBalance } = useBalanceStore();

  useEffect(() => {
    fetchExpenses(filters);
  }, [fetchExpenses, filters]);

  const handleSubmit = async (data) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success('Expense updated successfully');
      } else {
        await createExpense(data);
        toast.success('Expense added successfully');
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      fetchBalance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        toast.success('Expense deleted successfully');
        fetchBalance();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage your expenses</p>
        </div>
        <Button
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <ExpenseFilters filters={filters} onFilterChange={handleFilterChange} />

      <ExpenseList
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          onSubmit={handleSubmit}
          initialData={editingExpense}
          loading={loading}
        />
      </Modal>
    </div>
  );
};