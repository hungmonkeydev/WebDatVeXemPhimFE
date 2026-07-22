import api from './api';

export const movieService = {
  getMovies: async () => {
    return api.get('/movies');
  },
  getNowShowing: async (page = 0, size = 20) => {
    return api.get(`/movies/now-showing?page=${page}&size=${size}`);
  },
  getComingSoon: async (page = 0, size = 20) => {
    return api.get(`/movies/coming-soon?page=${page}&size=${size}&sort=releaseDate,asc`);
  },
  getImax: async (page = 0, size = 20) => {
    return api.get(`/movies/imax?page=${page}&size=${size}`);
  },
  getMovieDetail: async (id: string) => {
    return api.get(`/movies/${id}`);
  },
  getOutstanding: (limit = 10, minRating = 0, minBookings = 0) => {
    return api.get('/movies/outstanding', { params: { limit, minRating, minBookings } });
  },
  getTopRated: async () => {
    return api.get("/movies/top-rated", {
      params: {
        minReviews: 1, // Ép điều kiện xuống 1 review, ĐẢM BẢO LỚN HƠN HOẶC BẰNG 1 (không bị 400)
        limit: 10      // (Tùy chọn) Giới hạn số lượng trả về
      }
    });
  },
  searchMovies: async (params: {
    keyword?: string;
    genreIds?: number[];
    page?: number;
    size?: number;
  }) => {
    return api.get('/movies', {
      params: {
        keyword: params.keyword || undefined,
        genreIds: params.genreIds?.length ? params.genreIds.join(',') : undefined,
        page: params.page ?? 0,
        size: params.size ?? 20,
      },
    });
  }
};
