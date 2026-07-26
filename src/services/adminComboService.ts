import api from "./api";

export const adminComboService = {
    getAll: async (params?: any) => {
        const response = await api.get('/admin/combos', { params });
        return response.data;
    },

    getById: async (id: number | string) => {
        const response = await api.get(`/admin/combos/${id}`);
        return response.data;
    },

    create: async (comboData: any) => {
        const response = await api.post('/admin/combos', comboData);
        return response.data;
    },

    update: async (id: number | string, comboData: any) => {
        const response = await api.put(`/admin/combos/${id}`, comboData);
        return response.data;
    },

    delete: async (id: number | string) => {
        const response = await api.delete(`/admin/combos/${id}`);
        return response.data;
    },

    toggleActive: async (id: number | string) => {
        const response = await api.patch(`/admin/combos/${id}/toggle-active`);
        return response.data;
    }
};