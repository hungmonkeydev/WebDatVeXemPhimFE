import api from './api';
export const reviewService = {
  submitReview: async (reviewData: { movieId: number; rating: number; comment: string }) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  getReviewsByMovieId: async (movieId: string | number) => {
    const response = await api.get(`/reviews/${movieId}`);
    return response.data;
  }
};