import api
    from "./api";
export const adminUserService = {
    //Admin 
  getUsers: async (page: number, size: number) => {
        const response = await api.get('/admin/users', {
            params: { page: page - 1, size: size } 
        });
        return response.data;
    },
    getUserDetail: async (userId: number) => {
        return await api.get(`/admin/users/${userId}`);
    },
    createUser: async (userData: any) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },
    updateUserRole: async (userId: number, roleData: any) => {
        return await api.put(`/admin/users/${userId}/role`, roleData);
    },
    updateUser: async (userId: number, userData: any) => {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
    },

    deleteUser: async (userId: number) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },
    getDashboardStats: async () => {
        const response = await api.get('/admin/users/dashboard');
        return response.data;
    },
    unBanUser: async (userId: number) => {
        return await api.post(`/admin/users/${userId}/unban`);
    }, banUser: async (userId: number, data: { reason: string, lockDurationHours: number }) => {
        return await api.post(`/admin/users/${userId}/ban`, data);
    },

    // Reset mật khẩu
    resetPassword: async (userId: number, data: { newPassword: string }) => {
        const response = await api.post(`/admin/users/${userId}/reset-password`, data);
        return response.data;
    },
    // Khôi phục user đã xóa mềm
    restoreUser: async (userId: number) => {
        const response = await api.post(`/admin/users/${userId}/restore`);
        return response.data;
    },
    // Quản lý phiên đăng nhập (Sessions)
    getUserSessions: async (userId: number) => {
        const response = await api.get(`/admin/users/${userId}/sessions`);
        return response.data;
    },
    revokeAllSessions: async (userId: number) => {
        const response = await api.delete(`/admin/users/${userId}/sessions`);
        return response.data;
    },
    revokeSession: async (userId: number, tokenId: string) => {
        const response = await api.delete(`/admin/users/${userId}/sessions/${tokenId}`);
        return response.data;
    },
    // Import / Export
    exportToCSV: async () => {
        const response = await api.get('/admin/users/export/csv', { responseType: 'blob' });
        return response.data;
    },
    exportToExcel: async () => {
        const response = await api.get('/admin/users/export/excel', { responseType: 'blob' });
        return response.data;
    },
    importFromCSV: async (formData: FormData) => {
        const response = await api.post('/admin/users/import/csv', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    importFromExcel: async (formData: FormData) => {
        const response = await api.post('/admin/users/import/excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getImportTemplate: async () => {
        const response = await api.get('/admin/users/import/template', { responseType: 'blob' });
        return response.data;
    }
} 