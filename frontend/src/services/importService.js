
import api from './api';

export const importService = {
  importCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  importExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/import/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  confirmImport: async (expenses) => {
    const response = await api.post('/import/confirm', { expenses });
    return response.data;
  },
};
