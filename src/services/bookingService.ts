import api from './api';

export const bookingService = {
  getSeats: async (showtimeId: string) => {
    return api.get(`/showtimes/${showtimeId}/seatmap`);
  },

  holdSeats: async (showtimeId: string, seatIds: number[]) => {
    return api.post('/bookings/hold-seats', {
      showtimeId: Number(showtimeId),
      seatIds: seatIds,
    });
  },
  getBookingCaculate: async (payload: any) => {
    return await api.post('/bookings/calculate', payload);
  },
  getBookingDetail: async (bookingId: number | string) => {
    return await api.get(`/bookings/${bookingId}`);
  },
  getCombos: async () => {
    return api.get('/combos');
  },
  createBooking: async (payload: any) => {
    const response = await api.post('/bookings/create', payload);
    return response;
  },

  getMyBookings: async () => {
    return await api.get('/bookings/my-bookings');
  },
  guestCalculateCost: async (payload: any) => {
    return await api.post('/bookings/public/guestCaculate', payload);
  },

  guestCreateBooking: async (payload: any) => {
    return await api.post('/bookings/public/guestCreateBooking', payload);
  },

  releaseSeat: async (payload: { showtimeId: number, seatId: number }) => {
    return await api.post('/bookings/release-seat', payload);
  },

  releaseAllSeats: async () => {
    return await api.post('/bookings/release-seats');
  },
  createPaymentUrl: async (payload: { bookingId: number, amount: number, orderInfo: string, bankCode?: string, locale?: string }) => {
    const response = await api.post('/payments/vnpay/create', payload, {
      params: { bookingId: payload.bookingId }
    });
    return response;
  },
  createPaymentUrlForGuest: async (payload: {
    bookingId: number;
    amount: number;
    orderInfo: string;
    bankCode: string;
    locale: string;
  }) => {
    return api.post(`/payments/public/vnpay/createForGuest?bookingId=${payload.bookingId}`, payload);
  },
  verifyVNPayCallback: async (queryString: string) => {
    const response = await api.get(`/payments/vnpay/callback${queryString}`);
    return response;
  }
};
