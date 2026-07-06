import api from "./api";
export const showtimeService = {
     getShowtimes: async (params: {movieId: string, date: string}) => {
    return api.get('/showtimes', {
      params: {
       movieId: params.movieId, 
        date: params.date,
        activeOnly: true,
        futureOnly: true,
        groupBy: "CINEMA", 
        sortBy: "START_TIME",
        includeAvailableSeats: true,
        valid: true
      },
    });
  },

  getShowtimeDetail: async (showtimeId: string) => {
    return api.get(`/showtimes/${showtimeId}`);
  },
  getShowtimesByMovie: async (movieId: number) => {
    const response = await api.get(`/showtimes/by-movie/${movieId}`, {
      params: { groupBy: 'CINEMA' } 
    });
    return response.data;
  }
};