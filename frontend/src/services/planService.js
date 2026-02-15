
import api from './api';

export const planService = {
  getAll: async () => {
    const response = await api.get('/plans');
    return response.data.plans;
  },

  getById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data.plan;
  },

  create: async (data) => {
    const response = await api.post('/plans', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/plans/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },

  addExpense: async (planId, expenseId) => {
    const response = await api.post(`/plans/${planId}/expenses`, { expenseId });
    return response.data;
  },

  removeExpense: async (planId, expenseId) => {
    const response = await api.delete(`/plans/${planId}/expenses/${expenseId}`);
    return response.data;
  },
};