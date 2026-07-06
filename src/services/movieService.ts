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
