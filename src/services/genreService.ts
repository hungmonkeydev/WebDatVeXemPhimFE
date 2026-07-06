import api from "./api";export const genreService = {
  getAllGenres: async () => {
    const response = await api.get('/api/genres');
    return response.data;
  }
};