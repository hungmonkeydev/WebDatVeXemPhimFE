import api from "./api";
export const genreService = {
  getAllGenres: async () => {
    const response = await api.get('/genres');
    return response.data;
  }
};