import api from "./api"; // Đảm bảo import đúng api instance của pro

export const RevenueService = {
  // Hàm này overview thường không cần ngày tháng nên để trống ()
  getOverview: async (params?: any) => {
    const response = await api.get('/admin/revenue/overview', { params });
    return response.data;
  },

  // THÊM (params?: any) VÀO NHỮNG HÀM CẦN LỌC
  getByPeriod: async (params?: any) => {
    const response = await api.get('/admin/revenue/by-period', { params });
    return response.data;
  },

  getByMovie: async (params?: any) => {
    const response = await api.get('/admin/revenue/by-movie', { params });
    return response.data;
  },

  getByRoom: async (params?: any) => {
    const response = await api.get('/admin/revenue/by-room', { params });
    return response.data;
  },

  getByPaymentMethod: async (params?: any) => {
    const response = await api.get('/admin/revenue/by-payment-method', { params });
    return response.data;
  }
};