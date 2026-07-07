import api from './api';

export const userService = {
  getProfile: async () => {
    return api.get('/users/profile');
  },

  updateProfile: async (formData: {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
  }) => {
    return api.patch('/users/profile', formData);
  },
  banUser: async (userId: number, data: { reason: string, lockDurationHours: number }) => {
    return await api.post(`/admin/users/${userId}/ban`, data);
  },
  unBanUser: async (userId: number) => {
    return await api.post(`/admin/users/${userId}/unban`);
  },

  //Admin 
  getUsers: async (page: number, size: number) => {
    const response = await api.get('/admin/users', {
      params: { page: page - 1, size: size, isDeleted: false }
    });
    return response.data;
  },
  getUserDetail: async (userId: number) => {
    return await api.get(`/admin/users/${userId}`);
  },
  createUser: async (userData: any) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  updateUserRole: async (userId: number, roleData: any) => {
    return await api.put(`/admin/users/${userId}/role`, roleData);
  },
  updateUser: async (userId: number, userData: any) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  getDashboardStats: async () => {
    const response = await api.get('/admin/users/dashboard');
    return response.data;
  }
};