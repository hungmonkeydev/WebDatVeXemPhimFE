import api from "./api"; 

export const adminVoucherService = {
  getAll: async (params?: any) => {
    const response = await api.get('/admin/vouchers', { params });
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(`/admin/vouchers/${id}`);
    return response.data;
  },

  create: async (voucherData: any) => {
    const response = await api.post('/admin/vouchers', voucherData);
    return response.data;
  },

  update: async (id: number | string, voucherData: any) => {
    const response = await api.put(`/admin/vouchers/${id}`, voucherData);
    return response.data;
  },

  lock: async (id: number | string) => {
    const response = await api.patch(`/admin/vouchers/${id}/lock`);
    return response.data;
  },

  unlock: async (id: number | string) => {
    const response = await api.patch(`/admin/vouchers/${id}/unlock`);
    return response.data;
  },

  updateStatus: async (id: number | string, statusData: any) => {
    const response = await api.patch(`/admin/vouchers/${id}/status`, statusData);
    return response.data;
  }
};