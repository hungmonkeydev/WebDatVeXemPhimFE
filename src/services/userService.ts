import api from './api';
export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  birthDate: string;
  gender: string;
}

export const userService = {
  getProfile: async () => {
    return api.get('/users/profile');
  },
  updateProfile: async (formData: UpdateProfilePayload) => {
    const response = await api.put('/users/profile', formData);
    return response.data;
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