import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { message } from 'antd';

export const useAdminDashboard = () => {
    const [userStats, setUserStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const responseData = await userService.getDashboardStats();
                setUserStats(responseData.data); 
            } catch (err: any) {
                console.error("Lỗi chi tiết từ Backend:", err.response?.data);
                message.error('Lỗi kết nối máy chủ. Không thể tải dữ liệu thống kê!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return { userStats, isLoading };
};