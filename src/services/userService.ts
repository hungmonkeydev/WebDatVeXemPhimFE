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


  getMyPointsProgress: async () => {
    const response = await api.get('/loyalty/my-points');
    return response.data;
  },
  getLoyaltyHistory: async () => {
    const response = await api.get('/loyalty/history');
    return response.data;
  },

  
};