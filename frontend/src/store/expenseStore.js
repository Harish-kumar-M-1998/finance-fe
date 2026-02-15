
import { create } from 'zustand';
import { expenseService } from '../services/expenseService';

export const useExpenseStore = create((set) => ({
  expenses: [],
  stats: null,
  loading: false,
  error: null,
  pagination: null,

  fetchExpenses: async (params) => {
    set({ loading: true });
    try {
      const data = await expenseService.getAll(params);
      set({
        expenses: data.expenses,
        pagination: data.pagination,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch expenses',
        loading: false,
      });
    }
  },

  fetchStats: async (params) => {
    try {
      const data = await expenseService.getStats(params);
      set({ stats: data });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch stats',
      });
    }
  },

  createExpense: async (expenseData) => {
    try {
      const data = await expenseService.create(expenseData);
      set((state) => ({
        expenses: [data.expense, ...state.expenses],
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create expense',
      });
      throw error;
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      const data = await expenseService.update(id, expenseData);
      set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === id ? data.expense : exp
        ),
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update expense',
      });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      await expenseService.delete(id);
      set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete expense',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));