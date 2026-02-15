
import { create } from 'zustand';
import { planService } from '../services/planService';

export const usePlanStore = create((set) => ({
  plans: [],
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true });
    try {
      const plans = await planService.getAll();
      set({ plans, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch plans',
        loading: false,
      });
    }
  },

  createPlan: async (planData) => {
    try {
      const data = await planService.create(planData);
      set((state) => ({
        plans: [...state.plans, data.plan],
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create plan',
      });
      throw error;
    }
  },

  updatePlan: async (id, planData) => {
    try {
      const data = await planService.update(id, planData);
      set((state) => ({
        plans: state.plans.map((plan) =>
          plan.id === id ? data.plan : plan
        ),
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update plan',
      });
      throw error;
    }
  },

  deletePlan: async (id) => {
    try {
      await planService.delete(id);
      set((state) => ({
        plans: state.plans.filter((plan) => plan.id !== id),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete plan',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));