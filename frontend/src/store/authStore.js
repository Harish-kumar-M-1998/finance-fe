
import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        loading: false,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
