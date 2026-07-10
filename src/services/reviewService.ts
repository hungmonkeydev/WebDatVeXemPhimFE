import api from './api';
export const reviewService = {
  submitReview: async (reviewData: { movieId: number; rating: number; comment: string }) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  }
};