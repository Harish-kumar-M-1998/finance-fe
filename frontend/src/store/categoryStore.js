
import { create } from 'zustand';
import { categoryService } from '../services/categoryService';

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const categories = await categoryService.getAll();
      set({ categories, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch categories',
        loading: false,
      });
    }
  },

  createCategory: async (categoryData) => {
    try {
      const data = await categoryService.create(categoryData);
      set((state) => ({
        categories: [...state.categories, data.category],
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create category',
      });
      throw error;
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const data = await categoryService.update(id, categoryData);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? data.category : cat
        ),
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update category',
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await categoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete category',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));