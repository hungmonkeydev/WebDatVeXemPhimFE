import api from "./api"; 

export const adminBookingService = {
  getAll: async (params?: any) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id: number | string, statusData: any) => {
    // Truyền body chứa status mới xuống Backend
    const response = await api.patch(`/admin/bookings/${id}/status`, statusData); 
    return response.data;
  },

  cancel: async (id: number | string) => {
    const response = await api.delete(`/admin/bookings/${id}/cancel`);
    return response.data;
  }
};