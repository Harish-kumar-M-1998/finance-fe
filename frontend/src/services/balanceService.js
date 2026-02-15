
import api from './api';

export const balanceService = {
  getBalance: async () => {
    const response = await api.get('/balance');
    return response.data;
  },

  getHistory: async (params) => {
    const response = await api.get('/balance/history', { params });
    return response.data;
  },

  addCredit: async (data) => {
    const response = await api.post('/balance/credit', data);
    return response.data;
  },

  addDebit: async (data) => {
    const response = await api.post('/balance/debit', data);
    return response.data;
  },
};
