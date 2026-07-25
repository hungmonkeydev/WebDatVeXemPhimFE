import api from "./api";

export const adminShowtimeService = {
    getAll: async (params?: any) => {
        const response = await api.get('/admin/showtimes', { params });
        return response.data;
    },

    getById: async (id: number | string) => {
        const response = await api.get(`/admin/showtimes/${id}`);
        return response.data;
    },

    create: async (showtimeData: any) => {
        const response = await api.post('/admin/showtimes', showtimeData);
        return response.data;
    },

    update: async (id: number | string, showtimeData: any) => {
        const response = await api.put(`/admin/showtimes/${id}`, showtimeData);
        return response.data;
    },

    delete: async (id: number | string) => {
        const response = await api.delete(`/admin/showtimes/${id}`);
        return response.data;
    }
};