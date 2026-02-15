
import { create } from 'zustand';
import { balanceService } from '../services/balanceService';

export const useBalanceStore = create((set) => ({
  balance: 0,
  transactions: [],
  loading: false,
  error: null,

  fetchBalance: async () => {
    set({ loading: true });
    try {
      const data = await balanceService.getBalance();
      set({ balance: parseFloat(data.balance), loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch balance',
        loading: false,
      });
    }
  },

  fetchHistory: async (params) => {
    set({ loading: true });
    try {
      const data = await balanceService.getHistory(params);
      set({ transactions: data.transactions, loading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch history',
        loading: false,
      });
    }
  },

  addCredit: async (amount, description) => {
    try {
      const data = await balanceService.addCredit({ amount, description });
      set({ balance: parseFloat(data.balance) });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add credit',
      });
      throw error;
    }
  },

  addDebit: async (amount, description, title, categoryId) => {
    try {
      const data = await balanceService.addDebit({
        amount,
        description,
        title,
        categoryId,
      });
      set({ balance: parseFloat(data.balance) });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add debit',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));