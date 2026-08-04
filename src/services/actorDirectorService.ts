import api from './api';

export const actorDirectorService = {
  getActors: async (keyword: string = '', page: number = 0, size: number = 20) => {
    const response = await api.get('/admin/actors', {
      params: { keyword, page, size }
    });
    return response.data;
  },

  getDirectors: async (keyword: string = '', page: number = 0, size: number = 20) => {
    const response = await api.get('/admin/directors', {
      params: { keyword, page, size }
    });
    return response.data;
  }
};
