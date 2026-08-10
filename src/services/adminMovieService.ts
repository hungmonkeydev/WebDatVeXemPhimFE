import api from "./api"; 

export const adminMovieService = {
  getAll: async (params?: any) => {
    const response = await api.get('/admin/movies', { params });
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(`/admin/movies/${id}`);
    return response.data;
  },

  create: async (movieData: any) => {
    const response = await api.post('/admin/movies', movieData);
    return response.data;
  },

  update: async (id: number | string, movieData: any) => {
    const response = await api.put(`/admin/movies/${id}`, movieData);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(`/admin/movies/${id}`);
    return response.data;
  },

  restore: async (id: number | string) => {
    const response = await api.patch(`/admin/movies/${id}/restore`);
    return response.data;
  }
};