import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { message } from 'antd';

export const useLoyaltyProgress = () => {
    const [progressData, setProgressData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setProgressData(null);
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const response = await userService.getMyPointsProgress();
                console.log("Cục JSON BE trả về nè:", response.data);
                setProgressData(response.data);
            } catch (err: any) {
                console.error("Lỗi lấy thông tin điểm:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
        window.addEventListener('authChange', fetchProgress);
        return () => {
            window.removeEventListener('authChange', fetchProgress);
        };
    }, []);

    return { progressData, isLoading };
};