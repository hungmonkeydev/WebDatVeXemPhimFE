import api from './api';

export const adminPromotionService = {
  getAll: async (params: { page?: number; size?: number; keyword?: string; isActive?: boolean; discountType?: string }) => {
    return api.get('/admin/promotions', { params });
  },

  getById: async (id: number) => {
    return api.get(`/admin/promotions/${id}`);
  },

  create: async (payload: any) => {
    return api.post('/admin/promotions', payload);
  },

  update: async (id: number, payload: any) => {
    return api.put(`/admin/promotions/${id}`, payload);
  },

  delete: async (id: number) => {
    return api.delete(`/admin/promotions/${id}`);
  },

  restore: async (id: number) => {
    return api.patch(`/admin/promotions/${id}/restore`);
  },

  toggleActive: async (id: number) => {
    return api.patch(`/admin/promotions/${id}/toggle-active`);
  },

  getStats: async (id: number) => {
    return api.get(`/admin/promotions/${id}/stats`);
  },
};
